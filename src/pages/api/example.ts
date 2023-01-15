import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import type { FunctionReturnType } from '@app/interface/FunctionReturnType';
import { errorReturnValue } from '@app/interface/FunctionReturnType';
import { handleError } from '@app/lib/handleError';
import { logRequestParams } from '@app/lib/logRequestParams';

/**
 * ==============================
 * Endpoint's Relevent Interfaces
 * ==============================
 */
const SampleRequestReqDataSchema = z.object({ id: z.string() });

interface IExampleEndpointSuccessFunctionReturnType {
  result: string;
}

/**
 * =======================
 * Endpoint's HTTP Gateway
 * =======================
 * ! No logic should exist here (including AUTH).
 */
export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    FunctionReturnType<IExampleEndpointSuccessFunctionReturnType>
  >,
): Promise<void> => {
  logRequestParams(req);

  try {
    switch (req.method?.toLowerCase()) {
      case 'get': {
        const result = await handleGetExample(req);
        return res.status(result.data ? 200 : 400).json(result);
      }
      case 'post': {
        const result = await handlePostExample(req);
        return res.status(result.data ? 200 : 400).json(result);
      }
      default: {
        return res.status(405).json({
          success: false,
          data: {
            error: `Disallowed method. Received '${req.method}'`,
          },
        });
      }
    }
  } catch (e) {
    const result = handleError({
      e,
      failedTo: 'make api request to /api/example',
    });

    if (result.success) {
      const { error, info } = result.data;
      return res.status(500).json({ success: false, data: { error, info, e } });
    }

    return res
      .status(500)
      .json({ success: false, data: { error: 'Something went wrong.', e } });
  }
};

/**
 * ===================
 * Endpoint's Handlers
 * ===================
 */
// GET: Validates the request query. Returns unsuccessful if invalid.
const handleGetExample = async (
  req: NextApiRequest,
): Promise<FunctionReturnType<IExampleEndpointSuccessFunctionReturnType>> => {
  const result = SampleRequestReqDataSchema.safeParse(req.query);

  if (!result.success) {
    const error = `Failed to validate sample request query: '${result.error}'`;
    return errorReturnValue({ error });
  }

  return { success: true, data: { result: 'Valid' } };
};

// POST: Validates the request body. Returns unsuccessful if invalid.
const handlePostExample = async (
  req: NextApiRequest,
): Promise<FunctionReturnType<IExampleEndpointSuccessFunctionReturnType>> => {
  const result = SampleRequestReqDataSchema.safeParse(req.body);

  if (!result.success) {
    const error = `Failed to validate sample request body: '${result.error}'`;
    return errorReturnValue({ error });
  }

  return { success: true, data: { result: 'Valid' } };
};

/**
 * ====================================
 * Endpoint Handlers' Utility Functions
 * ====================================
 */
// UTILITY: Some function goes here.
