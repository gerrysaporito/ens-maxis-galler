import { Stack } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';

import { DocumentHead } from '@app/components/pure/DocumentHead';

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
  return { props: {} };
};
