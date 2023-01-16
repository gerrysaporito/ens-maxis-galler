import { join } from 'path';

import { getContractChainFromContractAddress } from './blockchain';
import type { FunctionReturnType } from './FunctionReturnType';

console.log(process.env.VERCEL_URL);
export const BASE_URL = process.env.VERCEL_URL
  ? process.env.VERCEL_URL ?? ''
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

export const ipfsToHttp = (url: string) =>
  url.replace('ipfs://', 'https://ipfs.io/ipfs/');
