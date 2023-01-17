import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { z } from 'zod';

import { Attributes } from '@app/interface/attributes';
import { isValidContractAddress } from '@app/interface/blockchain';
import { OrderType } from '@app/interface/constants';
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
const AttributesObject = Attributes.toObject();

export const PostNftsBodySchema = z.object({
  contractAddress: z.string(),
  pageNumber: z.number(),
  limitPerPage: z.number(),
  searchTerm: z.string().optional(),
  orderType: z
    .string()
    .refine((order) => Object.values(OrderType).includes(order as OrderType))
    .optional(),
  searchAttributes: z
    .record(z.string(), z.string().array())
    .refine(
      (attributes) => {
        const keys = Object.keys(attributes);
        for (const _key of keys) {
          const key = _key as keyof typeof AttributesObject;
          if (!(key in AttributesObject)) {
            return false;
          }
        }
        return true;
      },
      {
        message: `Search attribute keys must be one of the acceptable keys: ${Object.keys(
          AttributesObject,
        )
          .map((v) => `'${v}'`)
          .join(', ')}`,
      },
    )
    .refine(
      (attributes) => {
        for (const _key of Object.keys(attributes)) {
          const key = _key as keyof typeof attributes;
          const validValues = AttributesObject[
            key as keyof typeof AttributesObject
          ].map((v) => v.toLowerCase());
          for (const _value of attributes[key]) {
            const value = _value as unknown as typeof validValues;

            // @ts-ignore
            if (!validValues.includes(value.toLowerCase())) {
              return false;
            }
          }
        }
        return true;
      },
      {
        message: `Search attribute value is invalid`,
      },
    )
    .optional(),
});
export type PostNftsBodyType = z.infer<typeof PostNftsBodySchema>;

export interface IGetNfts {
  nfts: INft[];
  totalCount: number;
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
        await NextCors(req, res, { methods: ['POST'], origin: '*' });
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
  const {
    contractAddress,
    searchAttributes: _searchAttributes,
    pageNumber,
    limitPerPage,
    orderType,
    searchTerm,
  } = body.data;

  // Remove empty array search properties to avoid searching for nfts with no attributes.
  const searchAttributes = { ..._searchAttributes };
  for (const key of Object.keys(searchAttributes)) {
    if (!searchAttributes[key].length) {
      delete searchAttributes[key];
    }
  }

  // Check if contract address passed is valid.
  const validContractAddressResult = isValidContractAddress(contractAddress);
  if (!validContractAddressResult.success) {
    return validContractAddressResult;
  }

  const fileDataResult = readNftData(contractAddress);
  if (!fileDataResult.success) {
    return fileDataResult;
  }
  let { nfts } = fileDataResult.data;
  let totalCount = nfts.length;

  // Use only nfts that match the search term if provided.
  if (searchTerm) {
    nfts = filterNftsBySearchTerm({ nfts, searchTerm });
    totalCount = nfts.length;
  }

  // If no search attributes passed, return all NFTs for that page.
  if (
    !searchAttributes ||
    !Object.values(searchAttributes).filter((v) => v).length
  ) {
    nfts = getNftsByOrder({ orderType, nfts });
    nfts = getNftsForPage({
      nfts,
      pageNumber,
      limitPerPage,
    });
    return {
      success: true,
      data: {
        totalCount,
        nfts,
      },
    };
  }

  // There were search attributes passed so search for them and return for that page.
  nfts = filterNftsByAttributes({
    nfts,
    search: searchAttributes,
  });
  totalCount = nfts.length;

  nfts = getNftsByOrder({ orderType, nfts });
  nfts = getNftsForPage({
    nfts,
    pageNumber,
    limitPerPage,
  });
  return {
    success: true,
    data: {
      totalCount,
      nfts,
    },
  };
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
  search: PostNftsBodyType['searchAttributes'];
}) => {
  return nfts.filter((nft) => {
    let match = false;
    if (search) {
      for (const key of Object.keys(search)) {
        if (search[key].length) {
          const _key = key as keyof typeof nft.metadata.attributes;
          const nftAttr = nft.metadata.attributes[_key];
          for (const searchAttr of search[_key]) {
            if (String(nftAttr).toLowerCase() === searchAttr.toLowerCase()) {
              match = true;
            }
          }
        }
      }
    }
    return match;
  });
};

// UTILITY: Get NFTs within the page range.
const getNftsForPage = ({
  nfts,
  pageNumber,
  limitPerPage,
}: {
  nfts: INft[];
  pageNumber: number;
  limitPerPage: number;
}) => nfts.slice((pageNumber - 1) * limitPerPage, pageNumber * limitPerPage);

// UTILITY: Return nfts in requeseted order.
const getNftsByOrder = ({
  orderType,
  nfts,
}: {
  orderType?: string;
  nfts: INft[];
}) => {
  switch (orderType) {
    case OrderType.DESC: {
      return nfts.reverse();
    }
    case OrderType.SHUFFLE: {
      const copy = [...nfts];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
  }
  return nfts;
};

// UTILITY: Return all NFTs that match the search term provided.
const filterNftsBySearchTerm = ({
  nfts,
  searchTerm,
}: {
  nfts: INft[];
  searchTerm: string;
}) => {
  return nfts.filter((nft) => {
    const metadata = { ...nft.metadata, dna: '', image: '' };
    return JSON.stringify(metadata)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });
};
