import { EvmChain } from '@moralisweb3/common-evm-utils';

import { ENS_MAXIS_CONTRACT_ADDRESS } from './constants';
import type { FunctionReturnType } from './FunctionReturnType';
import { errorReturnValue } from './FunctionReturnType';

export const getContractChainFromContractAddress = (
  contractAddress: string,
): FunctionReturnType<string> => {
  switch (contractAddress) {
    case ENS_MAXIS_CONTRACT_ADDRESS:
      return { success: true, data: EvmChain.ETHEREUM.name ?? '' };
  }

  const error = 'No chain name associated with the contract address provided.';
  return errorReturnValue({ error });
};
