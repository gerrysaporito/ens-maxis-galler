import { Heading, Stack, Text } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import type { PropsWithChildren } from 'react';

import type { IGetNfts, PostNftsBodyType } from '../api/2023-01-14/nfts';
import { PageLayout } from '@app/components/layout/PageLayout';
import { DocumentHead } from '@app/components/pure/DocumentHead';
import { ENS_MAXIS_CONTRACT_ADDRESS } from '@app/interface/constants';
import { QueryParamsSchema } from '@app/interface/custom';
import type { FunctionReturnType } from '@app/interface/FunctionReturnType';
import { ROUTE_GET_NFTS_BY_METADATA } from '@app/interface/routes';
import { fetchClient } from '@app/lib/client';
import { handleError } from '@app/lib/handleError';

const GalleryPage: React.FC<FunctionReturnType<IGetNfts>> = ({
  success,
  data,
}) => {
  if (!success) {
    return (
      <HighLevelFrame>
        <Heading>Something went wrong.</Heading>
        <Text>{data.error}</Text>
      </HighLevelFrame>
    );
  }

  return (
    <HighLevelFrame>
      <PageLayout nfts={data.nfts} />
    </HighLevelFrame>
  );
};
export default GalleryPage;

const HighLevelFrame: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack h='100%'>
      <Head>
        <DocumentHead />
      </Head>
      <Stack h='100%'>{children}</Stack>
    </Stack>
  );
};

export const getServerSideProps: GetServerSideProps<
  FunctionReturnType<IGetNfts>
> = async ({ query }) => {
  const jsonBody: PostNftsBodyType = {
    contractAddress: ENS_MAXIS_CONTRACT_ADDRESS,
    limitPerPage: 100,
    pageNumber: 1,
  };

  // Update body params if found
  const queryResult = QueryParamsSchema.safeParse(query);
  if (queryResult.success) {
    jsonBody.limitPerPage = queryResult.data.limitPerPage;
    jsonBody.pageNumber = queryResult.data.pageNumber;
  }

  try {
    const result = await fetchClient<IGetNfts>({
      endpoint: ROUTE_GET_NFTS_BY_METADATA,
      method: 'post',
      jsonBody,
    });
    if (!result.success) {
      return {
        props: {
          success: false,
          data: {
            error: `Failed to get all NFTs on gallery page load: '${result.data.error}'`,
          },
        },
      };
    }

    return { props: { success: true, data: result.data } };
  } catch (e) {
    const result = handleError({
      e,
      failedTo: 'get all NFTs on gallery page load',
    });

    const { error } = result.data;
    return {
      props: {
        success: false,
        data: {
          error: `Failed to get all NFTs on gallery page load: '${error}'`,
        },
      },
    };
  }
};
