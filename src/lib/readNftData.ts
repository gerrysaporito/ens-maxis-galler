import fs from 'fs';

import type { FunctionReturnType } from '@app/interface/FunctionReturnType';
import { errorReturnValue } from '@app/interface/FunctionReturnType';
import type { INft } from '@app/interface/nft';
import { getFileLocation } from '@app/interface/routes';

export interface IFileDataFormat {
  updatedAt: Date;
  nfts: INft[];
}

export const readNftData = (
  contractAddress: string,
): FunctionReturnType<IFileDataFormat> => {
  if (typeof window !== 'undefined') {
    const error = 'readNftDatat can only be called from the server side.';
    return errorReturnValue({ error });
  }

  const fileLocationResult = getFileLocation(contractAddress);
  if (!fileLocationResult.success) {
    return fileLocationResult;
  }
  const fileLocation = fileLocationResult.data;

  try {
    const nftDataBuffer = fs.readFileSync(fileLocation, 'utf-8');
    const nftData = JSON.parse(nftDataBuffer) as IFileDataFormat;
    return { success: true, data: nftData };
  } catch (e) {
    const error = `Failed to read file located at: '${fileLocation}'`;
    return errorReturnValue({ error });
  }
};
