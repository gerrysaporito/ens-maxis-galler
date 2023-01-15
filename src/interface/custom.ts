import { z } from 'zod';

export const QueryParamsSchema = z.object({
  limitPerPage: z.preprocess(
    (val) =>
      typeof val === 'string' && !!parseInt(val) ? parseInt(val) : String(val),
    z.number(),
  ),
  pageNumber: z.preprocess(
    (val) =>
      typeof val === 'string' && !!parseInt(val) ? parseInt(val) : String(val),
    z.number(),
  ),
});
