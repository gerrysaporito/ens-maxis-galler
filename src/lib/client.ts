import { z } from 'zod';

import type { FunctionReturnType } from '@app/interface/FunctionReturnType';
import { BASE_URL } from '@app/interface/routes';

const HttpMethods = ['get', 'post', 'delete'] as const;
const FetchClientSchema = z.object({
  endpoint: z.string(),
  method: z.enum(HttpMethods),
  jsonBody: z.record(z.string(), z.unknown()).optional(),
  headers: z.record(z.string()).optional(),
});
type FetchClientType = z.infer<typeof FetchClientSchema>;

export const fetchClient = async <T>({
  endpoint,
  method,
  jsonBody,
  headers = {},
}: FetchClientType): Promise<FunctionReturnType<T>> => {
  if (!endpoint.startsWith('/')) {
    throw new Error(`Endpoint must start with '/'`);
  }

  const url = BASE_URL.includes('localhost')
    ? `${BASE_URL}${endpoint}`
    : endpoint;

  const result = await fetch(url, {
    body: jsonBody ? JSON.stringify(jsonBody) : undefined,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    method,
  });

  return result.json();
};
