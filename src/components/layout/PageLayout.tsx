import { Box, Grid } from '@chakra-ui/react';

import type { INft } from '@app/interface/nft';

import { Filter } from './Filter';
import { Gallery } from './Gallery';

interface IPageLayout {
  nfts: INft[];
}

export const PageLayout: React.FC<IPageLayout> = ({ nfts }) => {
  return (
    <Grid
      templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
      pl='10'
      pr='10'
    >
      <Box gridColumn={{ md: 'span 1' }} height='100vh'>
        <Filter />
      </Box>
      <Box gridColumn={{ md: 'span 3' }} height='100vh' overflowY='scroll'>
        <Gallery nfts={nfts} />
      </Box>
    </Grid>
  );
};
