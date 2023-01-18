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
  Link,
  Stack,
  Box,
} from '@chakra-ui/react';
import type { SetStateAction } from 'react';
import { GiDna1 } from 'react-icons/gi';

import { useIsMobile } from '@app/hooks/useIsMobile';
import { Attributes } from '@app/interface/attributes';
import type { INft } from '@app/interface/nft';
import { getMarketplaceUrls, ipfsToHttp } from '@app/interface/routes';
import { formatLeadingZeros, shortenString } from '@app/lib/string';

import { SocialIconLink } from './SocialIconLink';

const ModalTraitsIconMap: { [key: string]: string } = {
  Avatar: '/assets/EnsMaxisLogo.svg',
  Background: '/assets/EnsMaxisLogo.svg',
  'Maxis Ring': '/assets/EnsMaxisLogo.svg',
  MaxisRing: '/assets/EnsMaxisLogo.svg',
  Body: '/assets/EnsMaxisLogo.svg',
  Head: '/assets/EnsMaxisLogo.svg',
  Eyes: '/assets/EnsMaxisLogo.svg',
  Mouth: '/assets/EnsMaxisLogo.svg',
  Hair: '/assets/EnsMaxisLogo.svg',
  Clothing: '/assets/EnsMaxisLogo.svg',
  Nose: '/assets/EnsMaxisLogo.svg',
  Eyewear: '/assets/EnsMaxisLogo.svg',
  Accessory: '/assets/EnsMaxisLogo.svg',
  Headwear: '/assets/EnsMaxisLogo.svg',
};

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
  const { isMobile } = useIsMobile();
  const imgSource = nft.metadata.image.includes('ipfs://')
    ? ipfsToHttp(nft.metadata.image)
    : nft.metadata.image;

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalOverlay />
      <ModalContent width={isMobile ? '90%' : '80%'} minW='50vw' maxW='1250px'>
        <ModalCloseButton />
        <ModalBody p={isMobile ? '5' : '10'}>
          <SimpleGrid columns={{ sm: 1, md: 2 }} gap='8'>
            <SimpleGrid gap='10'>
              <Image
                src={imgSource}
                fallbackSrc='/assets/EnsMaxisLogo.webp'
                alt={nft.metadata.name}
                objectFit='cover'
                w='full'
                h='full'
                borderRadius='lg'
              />
            </SimpleGrid>
            <SimpleGrid gap='8'>
              <Box>
                <ModalHeading nft={nft} />
              </Box>
              <Box>
                <ModalNftAttributes nft={nft} />
              </Box>
              <Box>
                <ModalNftFingerprint nft={nft} />
              </Box>
            </SimpleGrid>
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
      <Flex flexDir='column' alignItems='flex-start'>
        <Text as='span' fontSize='sm' color='gray'>
          {nft.name.toUpperCase()}
        </Text>
        <Text as='span' fontSize='xl'>
          #{formatLeadingZeros(nft.token_id)}{' '}
        </Text>
      </Flex>
      {/* @ts-ignore */}
      <SimpleGrid columns='3' gap='2'>
        <Link href={opensea} isExternal color='blue'>
          <Image src='/assets/OpenseaLogo.svg' alt='Opensea logo' w='25px' />
        </Link>
        <Link href={looksrare} isExternal>
          <Image src='/assets/LooksRareLogo.svg' alt='Opensea logo' w='25px' />
        </Link>
        <Link href={ensvision} isExternal>
          <Image src='/assets/EnsVisionLogo.svg' alt='Opensea logo' w='25px' />
        </Link>
      </SimpleGrid>
    </Flex>
  );
};

const ModalNftAttributes: React.FC<{ nft: INft }> = ({ nft }) => {
  const { isMobile } = useIsMobile();
  const traits = isMobile
    ? Object.keys(nft.metadata.attributes).filter(
        (key) =>
          nft.metadata.attributes[key as keyof typeof nft.metadata.attributes],
      )
    : Attributes.traits();
  const mapTraits = (_traits: string[]) =>
    _traits.map((trait) => {
      return (
        <ModalNftAttributeItem
          key={trait}
          trait={trait}
          iconSrc={ModalTraitsIconMap[trait]}
          attributes={nft.metadata.attributes as Record<string, string>}
        />
      );
    });

  const thirdLength = Math.ceil(traits.length / 3);
  const colOne = mapTraits(traits.slice(0, thirdLength));
  const colTwo = mapTraits(traits.slice(thirdLength, thirdLength * 2));
  const colThree = mapTraits(traits.slice(thirdLength * 2, traits.length));

  return (
    <SimpleGrid columns={{ sm: 1, md: 3 }} gap='4'>
      <SimpleGrid gap='4'>{colOne}</SimpleGrid>
      <SimpleGrid gap='4'>{colTwo}</SimpleGrid>
      <SimpleGrid gap='4'>
        {colThree}
        <Text />
        <Text />
      </SimpleGrid>
    </SimpleGrid>
  );
};

const ModalNftAttributeItem: React.FC<{
  trait: string;
  iconSrc: string;
  attributes: Record<string, string>;
}> = ({ trait, iconSrc, attributes }) => (
  <Flex p='2' borderRadius='md' backgroundColor='#88888844'>
    <Box>
      <Image src={iconSrc} alt={`${trait} icon`} />
    </Box>
    <Stack>
      <Text as='sub' fontSize='xs' color='gray'>
        {trait.toUpperCase()}:
      </Text>
      <Text fontSize='md'>{attributes[trait]}</Text>
    </Stack>
  </Flex>
);

const ModalNftFingerprint: React.FC<{ nft: INft }> = ({ nft }) => {
  const { isMobile } = useIsMobile();
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
          SocialIcon={GiDna1}
          label='Etherscan'
        />
        <Stack>
          <Text as='sub' color='gray'>
            DNA
          </Text>
          <Text fontSize='sm'>
            {isMobile ? shortenString(nft.metadata.dna) : nft.metadata.dna}
          </Text>
        </Stack>
      </Flex>
    </Flex>
  );
};
