import { z } from 'zod';

import { BASE_URL } from '@app/interface/routes';

const FetchClientSchema = z.object({
  endpoint: z.string(),
  method: z.enum(['get', 'post', 'delete']),
  jsonBody: z.unknown().optional(),
  headers: z.record(z.string()).optional(),
});
type FetchClientType = z.infer<typeof FetchClientSchema>;

export const fetchClient = async <T>({
  endpoint,
  method,
  jsonBody,
  headers = {},
}: FetchClientType): Promise<T> => {
  if (!endpoint.startsWith('/')) {
    throw new Error(`Endpoint must start with '/'`);
  }

  const appUrl =
    typeof window === 'undefined' ? `${BASE_URL}${endpoint}` : endpoint;

  const url = endpoint.includes('https://') ? appUrl : endpoint;

  const result = await fetch(url, {
    body: jsonBody ? JSON.stringify(jsonBody) : undefined,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    method,
  });

  return result.json() as T;
};
