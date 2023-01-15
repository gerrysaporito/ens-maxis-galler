import type { GetServerSideProps } from 'next';
import type React from 'react';

import { ROUTE_GALLERY } from '@app/interface/routes';

const Home: React.FC = () => {
  return null;
};
export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: ROUTE_GALLERY,
      permanent: false,
    },
  };
};
