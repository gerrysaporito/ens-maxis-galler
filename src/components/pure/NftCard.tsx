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
      <Box boxShadow='xl' borderRadius='lg' w='full' h='full'>
        <Image
          borderRadius='lg'
          src={imgSource}
          fallbackSrc='/assets/EnsMaxisLogo.svg'
          alt={nft.metadata.name}
          objectFit='contain'
          w='full'
        />
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
