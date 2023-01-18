import { join } from 'path';

import { formatLeadingZeros } from '@app/lib/string';

import { getContractChainFromContractAddress } from './blockchain';
import { ENS_MAXIS_CONTRACT_ADDRESS } from './constants';
import type { FunctionReturnType } from './FunctionReturnType';

export const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL}`
    : 'http://localhost:3000';

// Client-side routes
export const ROUTE_GALLERY = '/gallery';

// Server-side routes
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

// External
export const ENS_MAXIS_WEBSITE = 'https://ensmaxis.com/';
export const PERSONAL_TWITTER = 'https://twitter.com/saporito_eth/';
export const ipfsToHttp = (url: string) =>
  url.replace('ipfs://', 'https://ipfs.io/ipfs/');

export const getMarketplaceUrls = ({
  tokenId,
}: {
  tokenId: number | string;
}): {
  opensea: string;
  looksrare: string;
  ensvision: string;
  etherscan: string;
} => ({
  opensea: `https://opensea.io/assets/ethereum/${ENS_MAXIS_CONTRACT_ADDRESS}/${tokenId}`,
  looksrare: `https://looksrare.org/collections/${ENS_MAXIS_CONTRACT_ADDRESS}/${tokenId}`,
  ensvision: `https://ens.vision/name/${formatLeadingZeros(tokenId)}`,
  etherscan: `https://etherscan.io/token/${ENS_MAXIS_CONTRACT_ADDRESS}?a=${tokenId}`,
});
