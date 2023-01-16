import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';

import { NftCard } from '../pure/NftCard';
import type { INft } from '@app/interface/nft';

interface IGallery {
  nfts: INft[];
}

export const Gallery: React.FC<IGallery> = ({ nfts }) => {
  const cards = nfts.map((nft) => (
    <NftCard key={nft.metadata.name} nft={nft} />
  ));

  return (
    <SimpleGrid columns={{ sm: 2, md: 4 }} gap='8'>
      {cards}
    </SimpleGrid>
  );
};
