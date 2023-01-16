import { Text, Image, Stack, Box } from '@chakra-ui/react';

import type { INft } from '@app/interface/nft';
import { ipfsToHttp } from '@app/interface/routes';

interface INftCard {
  nft: INft;
}

export const NftCard: React.FC<INftCard> = ({ nft }) => {
  const imgSource = nft.metadata.image.includes('ipfs://')
    ? ipfsToHttp(nft.metadata.image)
    : nft.metadata.image;
  return (
    <Stack>
      <Box boxShadow='xl' borderRadius='2xl'>
        <Image borderRadius='2xl' src={imgSource} alt={nft.metadata.name} />
      </Box>
      <Stack textAlign='center'>
        <Text fontSize='xs' variant='s'>
          {nft.name.toUpperCase()}
        </Text>
        <Text fontSize='md'>No. {nft.token_id}</Text>
      </Stack>
    </Stack>
  );
};
