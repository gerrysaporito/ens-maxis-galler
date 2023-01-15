import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { isValidContractAddress } from '@app/interface/blockchain';
import type { FunctionReturnType } from '@app/interface/FunctionReturnType';
import { errorReturnValue } from '@app/interface/FunctionReturnType';
import type { INft } from '@app/interface/nft';
import { handleError } from '@app/lib/handleError';
import { logRequestParams } from '@app/lib/logRequestParams';
import { readNftData } from '@app/lib/readNftData';

/**
 * ==============================
 * Endpoint's Relevent Interfaces
 * ==============================
 */
const GetSingleNftQuerySchema = z.object({
  tokenId: z.string(),
  contractAddress: z.string(),
});

export interface IGetNft {
  nft: INft;
}

/**
 * =======================
 * Endpoint's HTTP Gateway
 * =======================
 * ! No logic should exist here (including AUTH).
 */
export default async (
  req: NextApiRequest,
  res: NextApiResponse<FunctionReturnType<IGetNft>>,
): Promise<void> => {
  logRequestParams(req);

  try {
    switch (req.method?.toLowerCase()) {
      case 'get': {
        const result = await handleGetNfts(req);
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
      failedTo: 'make api request to /api/2023-01-14/nfts/[tokenId]',
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
const handleGetNfts = async (
  req: NextApiRequest,
): Promise<FunctionReturnType<IGetNft>> => {
  const query = GetSingleNftQuerySchema.safeParse(req.query);

  if (!query.success) {
    const error = `Failed to validate request query`;
    return errorReturnValue({ error, info: query.error.format() });
  }
  const { tokenId, contractAddress } = query.data;

  // Check if contract address passed is valid.
  const validContractAddressResult = isValidContractAddress(contractAddress);
  if (!validContractAddressResult.success) {
    return validContractAddressResult;
  }

  const fileDataResult = readNftData(contractAddress);
  if (!fileDataResult.success) {
    return fileDataResult;
  }
  const { nfts } = fileDataResult.data;

  const nft = nfts.filter((_nft) => _nft.token_id === parseInt(tokenId));
  if (nft.length === 0) {
    const error = `No NFT found with tokenId: '${tokenId}'`;
    return errorReturnValue({ error });
  }
  return { success: true, data: { nft: nft[0] } };
};
