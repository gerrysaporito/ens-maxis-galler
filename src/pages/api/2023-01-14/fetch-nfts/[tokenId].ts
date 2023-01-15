import type { EvmNft } from '@moralisweb3/common-evm-utils';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import Moralis from 'moralis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { ENS_MAXIS_CONTRACT_ADDRESS } from '@app/interface/constants';
import type { FunctionReturnType } from '@app/interface/FunctionReturnType';
import { errorReturnValue } from '@app/interface/FunctionReturnType';
import { handleError } from '@app/lib/handleError';
import { logRequestParams } from '@app/lib/logRequestParams';

/**
 * ==============================
 * Endpoint's Relevent Interfaces
 * ==============================
 */
const MORALIS_API_KEY = process.env.MORALIS_API_KEY ?? '';
const GetFetchNftsQuerySchema = z.object({
  contractAddress: z.string(),
  pageNumber: z.number().optional(),
  countPerPage: z.number().optional(),
});

export interface IGetFetchNfts {
  nfts: EvmNft[];
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
      failedTo: 'make api request to /api/example',
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
// GET: Gets a single NFT by token id found in path.
const handleGetFetchNfts = async (
  req: NextApiRequest,
): Promise<FunctionReturnType<IGetFetchNfts>> => {
  const query = GetFetchNftsQuerySchema.safeParse(req.query);

  if (!query.success) {
    const error = `Failed to validate request query: '${query.error}'`;
    return errorReturnValue({ error });
  }
  const { contractAddress, pageNumber, countPerPage } = query.data;

  // In case the endpoint should be used for different contract addresses in future.
  const validContractAddresses = new Set([ENS_MAXIS_CONTRACT_ADDRESS]);
  if (!validContractAddresses.has(contractAddress)) {
    const validAddressesString = Array.from(validContractAddresses)
      .map((v) => `'${v}'`)
      .join(', ');
    const error = `Invalid contract address received. It should be on eof the following: '${validAddressesString}'`;
    return errorReturnValue({ error });
  }

  const totalRanges = 1000;
  const range = 1;

  await Moralis.start({ apiKey: MORALIS_API_KEY });

  const { result } = await Moralis.EvmApi.nft.getContractNFTs({
    address: contractAddress,
    chain: EvmChain.ETHEREUM,
    totalRanges,
    range,
  });

  //   const data = await fetchClient({
  //     method: 'get',
  //     headers: {
  //       'X-API-Key': MORALIS_API_KEY,
  //     },
  //     endpoint:
  //       'https://deep-index.moralis.io/api/v2/nft/0xaa462106da447c0440a4be29614c19387a59a331/5021?chain=0x1',
  //   });

  return { success: true, data: { nfts: result } };
};

/**
 * ====================================
 * Endpoint Handlers' Utility Functions
 * ====================================
 */
// UTILITY: Some function goes here.
