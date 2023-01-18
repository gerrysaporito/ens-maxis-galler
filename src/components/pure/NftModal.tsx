import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Image,
  Text,
  Flex,
  SimpleGrid,
  Heading,
  Icon,
  Link,
  Stack,
} from '@chakra-ui/react';
import type { SetStateAction } from 'react';

import { useIsMobile } from '@app/hooks/useIsMobile';
import type { INft } from '@app/interface/nft';
import { getMarketplaceUrls, ipfsToHttp } from '@app/interface/routes';
import { formatLeadingZeros } from '@app/lib/string';

interface INftModal {
  nft: INft;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
}

export const NftModal: React.FC<INftModal> = ({
  nft,
  isModalOpen,
  setIsModalOpen,
}) => {
  const imgSource = nft.metadata.image.includes('ipfs://')
    ? ipfsToHttp(nft.metadata.image)
    : nft.metadata.image;

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalOverlay />
      <ModalContent minW='50vw' maxW='1250px'>
        <ModalCloseButton />
        <ModalBody p='10'>
          <SimpleGrid columns={{ sm: 1, md: 2 }} gap='10'>
            <Image
              src={imgSource}
              fallbackSrc='/assets/EnsMaxisLogo.webp'
              alt={nft.metadata.name}
              objectFit='fill'
              w='full'
            />
            <Stack>
              <ModalHeading nft={nft} />
              <Text fontSize='md'>No. {nft.token_id}</Text>
            </Stack>
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ModalHeading: React.FC<{ nft: INft }> = ({ nft }) => {
  const { opensea, looksrare, ensvision } = getMarketplaceUrls({
    tokenId: nft.token_id,
  });
  return (
    <Flex
      alignItems='center'
      justifyContent='space-between'
      p='4'
      borderRadius='md'
      backgroundColor='#88888844'
    >
      <Stack>
        <Heading fontSize='lg' fontWeight='extrabold'>
          {nft.name.toUpperCase()}
        </Heading>
        <Text fontSize='3xl'>#{formatLeadingZeros(nft.token_id)}</Text>
      </Stack>
      <SimpleGrid columns={{ sm: 3 }} gap='2'>
        <Link href={opensea} isExternal color='blue'>
          <Image src='/assets/OpenseaLogo.svg' alt='Opensea logo' w='35px' />
        </Link>
        <Link href={looksrare} isExternal>
          <Image src='/assets/LooksRareLogo.svg' alt='Opensea logo' w='35px' />
        </Link>
        <Link href={ensvision} isExternal>
          <Image src='/assets/EnsVisionLogo.svg' alt='Opensea logo' w='35px' />
        </Link>
      </SimpleGrid>
    </Flex>
  );
};

const AttributesList: React.FC<{ nft: INft }> = ({ nft }) => {
  const { isMobile } = useIsMobile();

  return (
    <Flex flexDirection={isMobile ? 'column' : 'row'}>
      <Stack>{/* <Labe */}</Stack>
    </Flex>
  );
};
