import { ENS_MAXIS_CONTRACT_ADDRESS } from './constants';
import type { FunctionReturnType } from './FunctionReturnType';
import { errorReturnValue } from './FunctionReturnType';

export enum ChainName {
  ETHEREUM = 'Ethereum',
}

export const getContractChainFromContractAddress = (
  contractAddress: string,
): FunctionReturnType<string> => {
  switch (contractAddress) {
    case ENS_MAXIS_CONTRACT_ADDRESS:
      return { success: true, data: ChainName.ETHEREUM };
  }

  const error = 'No chain name associated with the contract address provided.';
  return errorReturnValue({ error });
};

export const isValidContractAddress = (
  contractAddress: string,
): FunctionReturnType<boolean> => {
  const validContractAddresses = new Set([ENS_MAXIS_CONTRACT_ADDRESS]);
  if (!validContractAddresses.has(contractAddress)) {
    const validAddressesString = Array.from(validContractAddresses)
      .map((v) => `'${v}'`)
      .join(', ');
    const error = `Invalid contract address received. It should be one of the following: '${validAddressesString}'`;
    return errorReturnValue({ error });
  }

  return { success: true, data: true };
};
