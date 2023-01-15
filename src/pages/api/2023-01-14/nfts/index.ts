import type { NextApiRequest, NextApiResponse } from 'next';
import { unknown, z } from 'zod';

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
const GetNftsBodySchema = z.object({
  contractAddress: z.string(),
  metadata: z.unknown(),
});

export interface IGetNfts {
  nfts: INft[];
}

/**
 * =======================
 * Endpoint's HTTP Gateway
 * =======================
 * ! No logic should exist here (including AUTH).
 */
export default async (
  req: NextApiRequest,
  res: NextApiResponse<FunctionReturnType<IGetNfts>>,
): Promise<void> => {
  logRequestParams(req);

  try {
    switch (req.method?.toLowerCase()) {
      case 'post': {
        const result = await handlePostNfts(req);
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
      failedTo: 'make api request to /api/2023-01-14/nfts',
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
const handlePostNfts = async (
  req: NextApiRequest,
): Promise<FunctionReturnType<IGetNfts>> => {
  const query = GetNftsBodySchema.safeParse(req.body);

  if (!query.success) {
    const error = `Failed to validate request query`;
    return errorReturnValue({ error, info: query.error.format() });
  }
  const { contractAddress } = query.data;

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

  getAllMetadataProperties(nfts);
  // const nft = nfts.filter((_nft) => _nft.token_id === parseInt(tokenId));
  // if (nft.length === 0) {
  //   const error = `No NFT found with tokenId: '${tokenId}'`;
  //   return errorReturnValue({ error });
  // }

  return { success: true, data: { nfts } };
};

const getAllMetadataProperties = (nfts: INft[]) => {
  const metadata = nfts.map((nft) => nft.metadata);
  const properties = new Set<string>();
  metadata.forEach((nft) =>
    nft.attributes.forEach((attribute) => {
      properties.add(attribute.trait_type);
    }),
  );
  console.log(properties);
};
