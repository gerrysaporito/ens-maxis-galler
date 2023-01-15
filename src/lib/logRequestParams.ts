import type { NextApiRequest } from 'next';

import { handleError } from './handleError';

/**
 * Only used to log api requests.
 */
export const logRequestParams = async (req: NextApiRequest) => {
  if (process.env.VERCEL_ENV !== 'production') {
    return;
  }

  try {
    const date = new Date();

    const { method, url } = req;
    const datePacificTime = `${date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    })} PT`;

    const logInfo = LOG_FORMAT({
      method: method ?? 'undefined',
      url: url ?? 'undefined',
      dateToDisplay: `${datePacificTime} | ${date.toISOString()}`,
      headers: JSON.stringify(req.headers, null, 2),
      body: JSON.stringify(req.body, null, 2),
    });
    console.log(logInfo);
  } catch (e) {
    handleError({
      e,
      failedTo: 'log request params',
    });
  }
};

const LOG_FORMAT = ({
  method,
  url,
  dateToDisplay,
  headers,
  body,
}: {
  method: string;
  url: string;
  dateToDisplay: string;
  headers: string;
  body: string;
}) => `
====================
/** REQUEST DATA **/
Method:.............${method}
Endpoint:...........${url}
Timestamp:..........${dateToDisplay}
------- Body -------
${body}
------ Header ------
${headers}
====================
`;
