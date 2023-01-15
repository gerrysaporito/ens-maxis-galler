import { ZodError } from 'zod';

import type { FunctionReturnType } from '@app/interface/FunctionReturnType';

interface IHandleError {
  error: string;
  info: unknown;
  e: unknown;
}

interface ILog extends IHandleError {
  failedTo: string;
}

export const handleError = ({
  e,
  failedTo,
}: {
  e: unknown;
  failedTo: string;
}): FunctionReturnType<IHandleError> => {
  let error = 'Something went wrong.';
  let info = {};

  if (e instanceof ZodError) {
    error = 'Invalid data params. See console for more details';
    info = cleanZodErrorFormatOutput(e.format());
  } else if (e instanceof Error) {
    error = e.message;
    info = {};
  }

  const log: ILog = { failedTo, error, info, e };
  console.log(log);

  return { success: true, data: { error, info, e } };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanZodErrorFormatOutput = (_obj: Record<string, any>) => {
  const obj = _obj;
  for (const prop of Object.keys(obj)) {
    if (prop === '_errors' && obj._errors?.length === 0) {
      delete obj[prop];
    } else if (typeof obj[prop] === 'object') {
      cleanZodErrorFormatOutput(obj[prop]);
    }
  }
  return obj;
};
