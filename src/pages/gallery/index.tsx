import { Stack } from '@chakra-ui/react';
import Head from 'next/head';
import type { PropsWithChildren } from 'react';

import type { IGetNfts } from '../api/2023-01-14/nfts';
import { PageLayout } from '@app/components/layout/PageLayout';
import { DocumentHead } from '@app/components/pure/DocumentHead';
import type { FunctionReturnType } from '@app/interface/FunctionReturnType';

const GalleryPage: React.FC<FunctionReturnType<IGetNfts>> = () => {
  return (
    <HighLevelFrame>
      <PageLayout />
    </HighLevelFrame>
  );
};
export default GalleryPage;

const HighLevelFrame: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack>
      <Head>
        <DocumentHead />
      </Head>
      <Stack>{children}</Stack>
    </Stack>
  );
};
