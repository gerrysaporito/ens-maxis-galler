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
      gridGap='10'
    >
      <Box gridColumn={{ md: 'span 1' }}>
        <Filter />
      </Box>
      <Box
        gridColumn={{ md: 'span 3' }}
        pr='10'
        height='90vh'
        overflowY='scroll'
      >
        <Gallery nfts={nfts} />
      </Box>
    </Grid>
  );
};
