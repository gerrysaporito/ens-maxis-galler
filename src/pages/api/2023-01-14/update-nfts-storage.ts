import { EvmChain } from '@moralisweb3/common-evm-utils';
import { isPast } from 'date-fns';
import fs from 'fs';
import Moralis from 'moralis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { ENS_MAXIS_CONTRACT_ADDRESS } from '@app/interface/constants';
import type { FunctionReturnType } from '@app/interface/FunctionReturnType';
import { errorReturnValue } from '@app/interface/FunctionReturnType';
import { getFileLocation } from '@app/interface/routes';
import { asyncDelayMs } from '@app/lib/asyncDelayMs';
import { handleError } from '@app/lib/handleError';
import { logRequestParams } from '@app/lib/logRequestParams';

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

interface IFileDataFormat {
  updatedAt: Date;
  nfts: unknown;
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

  // Check to see if we've recently queried the data.
  const fileLocationResult = getFileLocation(contractAddress);
  if (!fileLocationResult.success) {
    return fileLocationResult;
  }
  const fileLocation = fileLocationResult.data;
  const nftDataBuffer = fs.readFileSync(fileLocation, 'utf-8');
  const nftData = JSON.parse(nftDataBuffer) as IFileDataFormat;
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

  // In case the endpoint should be used for different contract addresses in future.
  const validContractAddresses = new Set([ENS_MAXIS_CONTRACT_ADDRESS]);
  if (!validContractAddresses.has(contractAddress)) {
    const validAddressesString = Array.from(validContractAddresses)
      .map((v) => `'${v}'`)
      .join(', ');
    const error = `Invalid contract address received. It should be one of the following: '${validAddressesString}'`;
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
        result.forEach((nft) => nfts.add(JSON.stringify(nft)));
      }

      // Avoid rate limiting.
      await asyncDelayMs(1000); // 1 seconds
    }
  } catch {}

  console.log({ size: nfts.size });
  saveDataToFile({
    nfts: Array.from(nfts).map((nft) => JSON.parse(nft)),
    contractAddress,
  });

  return { success: true, data: { countUpdated: nfts.size } };
};

/**
 * ====================================
 * Endpoint Handlers' Utility Functions
 * ====================================
 */
// UTILITY: Saves the NFT data to a file. Filename is a combination of the contract chain and address.
const saveDataToFile = ({
  nfts,
  contractAddress,
}: {
  nfts: unknown;
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
