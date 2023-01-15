import { Stack } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';

import { DocumentHead } from '@app/components/pure/DocumentHead';
import { ROUTE_GET_NFTS_BY_METADATA } from '@app/interface/routes';
import { fetchClient } from '@app/lib/client';

const Gallery: React.FC = () => {
  return (
    <Stack>
      <DocumentHead />
      <Stack>Hello World</Stack>
    </Stack>
  );
};
export default Gallery;

export const getServerSideProps: GetServerSideProps = async () => {
  const nfts = await fetchClient({
    endpoint: ROUTE_GET_NFTS_BY_METADATA,
    method: 'post',
    jsonBody: {},
  });
  console.log(nfts);
  return { props: {} };
};
