import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { isValidContractAddress } from '@app/interface/blockchain';
import type { FunctionReturnType } from '@app/interface/FunctionReturnType';
import { errorReturnValue } from '@app/interface/FunctionReturnType';
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
  attributes: Record<string, string[]>;
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
      case 'get': {
        const result = await handleGetCollectionMetadata(req);
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
      failedTo: 'make api request to /api/2023-01-14/collection/attributes',
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
const handleGetCollectionMetadata = async (
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

  const metadata = nfts.map((nft) => nft.metadata);
  const attributes: { [key: string]: Set<string> } = {};
  metadata.forEach((nft) =>
    nft.attributes.forEach((attribute) => {
      if (attribute.trait_type in attributes) {
        attributes[attribute.trait_type].add(attribute.value);
      } else {
        attributes[attribute.trait_type] = new Set([attribute.value]);
      }
    }),
  );

  const attr = Object.keys(attributes).reduce((store, key) => {
    const tempStore = store;
    tempStore[key] = Array.from(attributes[key]);
    return tempStore;
  }, {} as Record<string, string[]>);

  return { success: true, data: { attributes: attr } };
};
