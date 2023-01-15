import { join } from 'path';

import { getContractChainFromContractAddress } from './blockchain';
import type { FunctionReturnType } from './FunctionReturnType';

const PRODUCTION_URL = 'https://ensmaxis.com';
export const BASE_URL =
  process.env.VERCEL_ENV === 'production'
    ? PRODUCTION_URL
    : 'http://localhost:3000';

export const ROUTE_GALLERY = '/gallery';
export const ROUTE_GET_NFTS_BY_METADATA = '/api/2023-01-14/nfts';
export const ROUTE_GET_NFT = (tokenId: string | number) =>
  `/api/2023-01-14/nfts/${tokenId}`;

export const getFileLocation = (
  contractAddress: string,
): FunctionReturnType<string> => {
  const result = getContractChainFromContractAddress(contractAddress);
  if (!result.success) {
    return result;
  }
  const contractChain = result.data;
  const rootDir = process.cwd();
  const location = `/src/data/${contractChain.toLowerCase()}-${contractAddress.toLowerCase()}.json`;
  return { success: true, data: join(rootDir, location) };
};
