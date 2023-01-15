interface IErrorFunctionReturnTypeData {
  error: string;
  info?: unknown;
  e?: unknown;
}

interface IErrorFunctionReturnType {
  success: false;
  data: IErrorFunctionReturnTypeData;
}

interface ISuccessFunctionReturnType<T> {
  success: true;
  data: T;
}

export type FunctionReturnType<T> =
  | IErrorFunctionReturnType
  | ISuccessFunctionReturnType<T>;

export const errorReturnValue = (
  data: IErrorFunctionReturnTypeData,
): IErrorFunctionReturnType => ({ success: false, data });
