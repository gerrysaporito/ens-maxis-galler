import { Grid, Stack } from '@chakra-ui/react';
import { useState } from 'react';

import { Attributes } from '@app/interface/attributes';

import { Filter } from './Filter';
import { Gallery } from './Gallery';

const AttributesObject = Attributes.toObject();

export const PageLayout: React.FC = () => {
  // Attributes used to search NFTs for.
  const [searchAttributes, setSearchAttributes] = useState<
    Partial<{
      [key in keyof typeof AttributesObject]: string[];
    }>
  >({});

  return (
    <Grid
      templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
      gridGap='10'
    >
      <Stack gridColumn={{ md: 'span 1' }} id='filter'>
        <Filter
          searchAttributes={searchAttributes}
          setSearchAttributes={setSearchAttributes}
        />
      </Stack>
      <Stack gridColumn={{ md: 'span 3' }}>
        <Gallery
          searchAttributes={searchAttributes}
          setSearchAttributes={setSearchAttributes}
        />
      </Stack>
    </Grid>
  );
};
