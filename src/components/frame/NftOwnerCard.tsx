import { Flex, Stack, Text } from '@chakra-ui/react';
// import { ENS } from '@ensdomains/ensjs';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { FaFingerprint } from 'react-icons/fa';

import { SocialIconLink } from '../pure/SocialIconLink';
import { getMarketplaceUrls } from '@app/interface/routes';

interface INftOwnerCard {
  walletAddress: string;
  tokenId: string | number;
}
export const NftOwnerCard: React.FC<INftOwnerCard> = ({
  walletAddress,
  tokenId,
}) => {
  const [ensMeta, setEnsMeta] = useState<Record<string, any>>({});
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  // const ENSInstance = new ENS();

  const { etherscan } = getMarketplaceUrls({ tokenId });

  useEffect(() => {
    (async () => {
      // await ENSInstance.setProvider(provider);
      // const profile = await ENSInstance.getProfile(walletAddress);
      // if (profile) {
      //   setEnsMeta(profile);
      // }
    })();
  });
  console.log(ensMeta);

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
        </Stack>
      </Flex>
    </Flex>
  );
};
