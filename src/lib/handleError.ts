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

  if (e instanceof Error) {
    error = e.message;
    info = {};
  }

  const log: ILog = { failedTo, error, info, e };
  console.log(log);

  return { success: true, data: { error, info, e } };
};
