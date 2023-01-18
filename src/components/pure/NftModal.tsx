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
import Sub from 'date-fns/sub';
import type { SetStateAction } from 'react';
import { FaFingerprint } from 'react-icons/fa';

import { useIsMobile } from '@app/hooks/useIsMobile';
import type { INft } from '@app/interface/nft';
import { getMarketplaceUrls, ipfsToHttp } from '@app/interface/routes';
import { formatLeadingZeros } from '@app/lib/string';

import { SocialIconLink } from './SocialIconLink';

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
      <ModalContent width='80%' minW='50vw' maxW='1250px'>
        <ModalCloseButton />
        <ModalBody p='10'>
          <SimpleGrid columns={{ sm: 1, md: 2 }} gap='10'>
            <Image
              src={imgSource}
              fallbackSrc='/assets/EnsMaxisLogo.webp'
              alt={nft.metadata.name}
              objectFit='fill'
              w='full'
              borderRadius='lg'
            />
            <Flex flexDirection='column' justifyContent='space-between'>
              <ModalHeading nft={nft} />
              <ModalNftAttributes nft={nft} />
              <ModalNftFingerprint nft={nft} />
            </Flex>
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

const ModalNftAttributes: React.FC<{ nft: INft }> = ({ nft }) => {
  const { isMobile } = useIsMobile();

  return (
    <Flex flexDirection={isMobile ? 'column' : 'row'}>
      <Stack>{/* Hello */}</Stack>
    </Flex>
  );
};

const ModalNftFingerprint: React.FC<{ nft: INft }> = ({ nft }) => {
  const { etherscan } = getMarketplaceUrls({
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
      <Flex alignItems='center'>
        <SocialIconLink
          fontSize='2xl'
          href={etherscan}
          SocialIcon={FaFingerprint}
          label='Etherscan'
        />
        <Stack>
          <Text as='sub' variant='subtle'>
            Fingerprint
          </Text>
          <Text fontSize='sm'>{nft.token_hash}</Text>
        </Stack>
      </Flex>
    </Flex>
  );
};
