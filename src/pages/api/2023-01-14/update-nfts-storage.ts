import { EvmChain } from '@moralisweb3/common-evm-utils';
import { isPast } from 'date-fns';
import fs from 'fs';
import Moralis from 'moralis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { isValidContractAddress } from '@app/interface/blockchain';
import type { FunctionReturnType } from '@app/interface/FunctionReturnType';
import { errorReturnValue } from '@app/interface/FunctionReturnType';
import type { INft } from '@app/interface/nft';
import { getFileLocation } from '@app/interface/routes';
import { asyncDelayMs } from '@app/lib/asyncDelayMs';
import { handleError } from '@app/lib/handleError';
import { logRequestParams } from '@app/lib/logRequestParams';
import type { IFileDataFormat } from '@app/lib/readNftData';
import { readNftData } from '@app/lib/readNftData';

/**
 * ==============================
 * Endpoint's Relevent Interfaces
 * ==============================
 */
const QUERY_LIMIT = 100;
const MORALIS_API_KEY = process.env.MORALIS_API_KEY ?? '';
Moralis.start({ apiKey: MORALIS_API_KEY });

const GetFetchNftsQuerySchema = z.object({
  contractAddress: z.string(),
});

export interface IGetFetchNfts {
  countUpdated: number;
}

interface IMoralisNftResponseSchema {
  token_address: string;
  token_id: string;
  amount?: string;
  token_hash?: string;
  block_number_minted?: string;
  contract_type?: string;
  name?: string;
  symbol?: string;
  token_uri?: string;
  metadata?: string;
  last_token_uri_sync?: string;
  last_metadata_sync?: string;
  minter_address?: string;
}

/**
 * =======================
 * Endpoint's HTTP Gateway
 * =======================
 * ! No logic should exist here (including AUTH).
 */
export default async (
  req: NextApiRequest,
  res: NextApiResponse<FunctionReturnType<IGetFetchNfts>>,
): Promise<void> => {
  logRequestParams(req);

  try {
    switch (req.method?.toLowerCase()) {
      case 'get': {
        const result = await handleGetFetchNfts(req);
        return res.status(result.data ? 200 : 400).json(result);
      }
      default: {
        return res.status(405).json({
          success: false,
          data: {
            error: `Disallowed method. Received '${req.method}'`,
          },
        });
      }
    }
  } catch (e) {
    const result = handleError({
      e,
      failedTo: 'make api request to /api/2023-01-14/update-nfts-storage',
    });

    if (result.success) {
      const { error, info } = result.data;
      return res.status(500).json({ success: false, data: { error, info, e } });
    }

    return res
      .status(500)
      .json({ success: false, data: { error: 'Something went wrong.', e } });
  }
};

/**
 * ===================
 * Endpoint's Handlers
 * ===================
 */
// GET: Gets the whole collection of NFTs and saves it to a JSON file.
const handleGetFetchNfts = async (
  req: NextApiRequest,
): Promise<FunctionReturnType<IGetFetchNfts>> => {
  const query = GetFetchNftsQuerySchema.safeParse(req.query);

  if (!query.success) {
    const error = `Failed to validate request query: '${query.error}'`;
    return errorReturnValue({ error });
  }
  const { contractAddress } = query.data;

  // Check if contract address passed is valid.
  const validContractAddressResult = isValidContractAddress(contractAddress);
  if (!validContractAddressResult.success) {
    return validContractAddressResult;
  }

  // Check to see if we've recently queried the data.
  const fileDataResult = readNftData(contractAddress);
  if (!fileDataResult.success) {
    return fileDataResult;
  }
  const nftData = fileDataResult.data;

  const lastUpdated = new Date(nftData.updatedAt);
  const nextRequestPeriodStart = lastUpdated.setMilliseconds(
    lastUpdated.getMilliseconds() + 1000 * 60 * 5, // 5 minutes
  );

  if (!isPast(nextRequestPeriodStart)) {
    const diffSeconds =
      (new Date(nextRequestPeriodStart).getTime() - new Date().getTime()) /
      1000;
    const error = `You must wait ${diffSeconds} seconds attempting to update the nft list again.`;
    return errorReturnValue({ error });
  }

  const nfts = new Set<string>();

  // Query nft metadata for the contract.
  let cursor: string | undefined;
  try {
    for (let i = 0; i < 10_000 / QUERY_LIMIT; ++i) {
      console.log('Count:', QUERY_LIMIT * i);

      const response = await Moralis.EvmApi.nft.getContractNFTs({
        address: contractAddress,
        chain: EvmChain.ETHEREUM,
        limit: QUERY_LIMIT,
        cursor,
        disableTotal: true,
      });
      const { result, cursor: _cursor } = response.toJSON();
      cursor = _cursor;
      if (result) {
        const _nfts = formatMoralisNftResponse(result).map((nft) =>
          JSON.stringify(nft),
        );
        _nfts.forEach((nft) => nfts.add(nft));
      }

      // Avoid rate limiting.
      await asyncDelayMs(1000); // 1 seconds
    }
  } catch {}

  console.log({ size: nfts.size });
  saveDataToFile({
    nfts: Array.from(nfts).map((nft) => JSON.parse(nft) as INft),
    contractAddress,
  });

  return { success: true, data: { countUpdated: nfts.size } };
};

/**
 * ====================================
 * Endpoint Handlers' Utility Functions
 * ====================================
 */
// UTILITY: Format response from Moralis to fit nft data schema.
const formatMoralisNftResponse = (result: IMoralisNftResponseSchema[]) => {
  return result.map((_nft) => {
    const nft: INft = {
      token_address: _nft.token_address ?? '',
      token_id: parseInt(_nft.token_id),
      amount: parseInt(_nft.amount ?? '-1'),
      token_hash: _nft.token_hash ?? '',
      block_number_minted: _nft.block_number_minted ?? '',
      contract_type: _nft.contract_type ?? '',
      name: _nft.name ?? '',
      symbol: _nft.symbol ?? '',
      token_uri: _nft.token_uri ?? '',
      metadata: JSON.parse(_nft.metadata ?? '{}'),
      last_token_uri_sync: _nft.last_token_uri_sync
        ? new Date(_nft.last_token_uri_sync)
        : null,
      last_metadata_sync: _nft.last_metadata_sync
        ? new Date(_nft.last_metadata_sync)
        : null,
      minter_address: _nft.minter_address ?? '',
    };
    return nft;
  });
};

// UTILITY: Saves the NFT data to a file. Filename is a combination of the contract chain and address.
const saveDataToFile = ({
  nfts,
  contractAddress,
}: {
  nfts: INft[];
  contractAddress: string;
}): FunctionReturnType<IFileDataFormat> => {
  const data: IFileDataFormat = {
    updatedAt: new Date(),
    nfts,
  };

  const result = getFileLocation(contractAddress);
  if (!result.success) {
    return result;
  }
  const fileLocation = result.data;

  fs.writeFileSync(fileLocation, JSON.stringify(data, null, 2), {
    flag: 'w',
  });

  return { success: true, data };
};
