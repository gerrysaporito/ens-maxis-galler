import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { isValidContractAddress } from '@app/interface/blockchain';
import type { FunctionReturnType } from '@app/interface/FunctionReturnType';
import { errorReturnValue } from '@app/interface/FunctionReturnType';
import type { INft } from '@app/interface/nft';
import {
  NftAccessory,
  NftAvatar,
  NftBackground,
  NftBody,
  NftClothing,
  NftEyes,
  NftEyewear,
  NftHair,
  NftHead,
  NftHeadwear,
  NftMaxisRing,
  NftMouth,
  NftNose,
} from '@app/interface/nft';
import { handleError } from '@app/lib/handleError';
import { logRequestParams } from '@app/lib/logRequestParams';
import { readNftData } from '@app/lib/readNftData';

/**
 * ==============================
 * Endpoint's Relevent Interfaces
 * ==============================
 */
const PostNftsBodySchema = z.object({
  contractAddress: z.string(),
  pageNumber: z.number().optional(),
  limitPerPage: z.number().optional(),
  attributes: z
    .object({
      Avatar: z.enum(NftAvatar).optional(),
      Background: z.enum(NftBackground).optional(),
      'Maxis Ring': z.enum(NftMaxisRing).optional(),
      Body: z.enum(NftBody).optional(),
      Head: z.enum(NftHead).optional(),
      Eyes: z.enum(NftEyes).optional(),
      Mouth: z.enum(NftMouth).optional(),
      Hair: z.enum(NftHair).optional(),
      Clothing: z.enum(NftClothing).optional(),
      Nose: z.enum(NftNose).optional(),
      Eyewear: z.enum(NftEyewear).optional(),
      Accessory: z.enum(NftAccessory).optional(),
      Headwear: z.enum(NftHeadwear).optional(),
    })
    .optional(),
});
type PostNftsBodyType = z.infer<typeof PostNftsBodySchema>;

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
  const body = PostNftsBodySchema.safeParse(req.body);

  if (!body.success) {
    const error = `Failed to validate request body`;
    return errorReturnValue({ error, info: body.error.format() });
  }
  const { contractAddress, attributes, pageNumber, limitPerPage } = body.data;

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

  let filteredNfts = filterNftsByAttributes({
    nfts,
    search: attributes,
  });

  if (pageNumber && limitPerPage) {
    filteredNfts = filteredNfts.slice(
      (pageNumber - 1) * limitPerPage,
      pageNumber * limitPerPage,
    );
  }

  return { success: true, data: { nfts: filteredNfts } };
};

/**
 * ====================================
 * Endpoint Handlers' Utility Functions
 * ====================================
 */
// UTILITY: Get NFTs whose attributes match the search attribute params.
const filterNftsByAttributes = ({
  nfts,
  search,
}: {
  nfts: INft[];
  search: PostNftsBodyType['attributes'];
}) => {
  return nfts.filter((nft) => {
    let match = true;
    if (search) {
      for (const key of Object.keys(search)) {
        const _key = key as keyof INft['metadata']['attributes'];
        const nftAttr = nft.metadata.attributes[_key];
        const searchAttr = search[_key];
        if (nftAttr !== searchAttr) {
          match = false;
        }
      }
    }
    return match;
  });
};
