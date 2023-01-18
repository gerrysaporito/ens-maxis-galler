import { Text, Image, Stack, Box } from '@chakra-ui/react';
import { useState } from 'react';

import type { INft } from '@app/interface/nft';
import { ipfsToHttp } from '@app/interface/routes';

import { NftModal } from './NftModal';

interface INftCard {
  nft: INft;
}

export const NftCard: React.FC<INftCard> = ({ nft }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imgSource = nft.metadata.image.includes('ipfs://')
    ? ipfsToHttp(nft.metadata.image)
    : nft.metadata.image;

  return (
    <Stack onClick={() => setIsModalOpen(true)}>
      <Box boxShadow='xl' borderRadius='lg' w='full' h='full'>
        <Image
          borderRadius='lg'
          src={imgSource}
          fallbackSrc='/assets/EnsMaxisLogo.webp'
          alt={nft.metadata.name}
          objectFit='fill'
          w='full'
        />
      </Box>
      <Stack textAlign='center'>
        <Text fontSize='xs' variant='s'>
          {nft.name.toUpperCase()}
        </Text>
        <Text fontSize='md'>No. {nft.token_id}</Text>
        <NftModal
          nft={nft}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </Stack>
    </Stack>
  );
};
