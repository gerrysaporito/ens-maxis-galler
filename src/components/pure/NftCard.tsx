import { Card, CardHeader, Image, Stack } from '@chakra-ui/react';

import type { INft } from '@app/interface/nft';

interface INftCard {
  nft: INft;
}
export const NftCard: React.FC<INftCard> = ({ nft }) => {
  return (
    <Stack>
      <Card>
        <Image src={nft.metadata.image} alt={nft.metadata.name} />
      </Card>
      <CardHeader>{nft.metadata.name}</CardHeader>
    </Stack>
  );
};
