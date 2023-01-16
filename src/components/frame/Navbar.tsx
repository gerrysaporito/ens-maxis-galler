import { Box, Flex, IconButton, Link, Text } from '@chakra-ui/react';
import { FaDiscord, FaTwitter, FaGlobe } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';

import { EnsMaxisLogo } from '../pure/EnsMaxisLogo';

const SOCIAL_LINKS = [
  { href: 'https://chat.ens.domains/', SocialIcon: FaDiscord },
  { href: 'https://twitter.com/ENSMaxisNFT/', SocialIcon: FaTwitter },
  { href: 'https://www.ensmaxis.com/', SocialIcon: FaGlobe },
];

export const Navbar: React.FC = () => {
  const socialLinks = SOCIAL_LINKS.map((meta, i) => (
    <SocialIconLink key={i} href={meta.href} SocialIcon={meta.SocialIcon} />
  ));

  return (
    <Flex
      pl='10'
      pr='10'
      pt='5'
      pb='5'
      justifyContent='space-between'
      alignItems='center'
    >
      <Box width='10' height='10'>
        <EnsMaxisLogo />
      </Box>
      <Flex>{socialLinks}</Flex>
    </Flex>
  );
};

interface ISocialIconLink {
  href: string;
  SocialIcon: IconType;
}
const SocialIconLink: React.FC<ISocialIconLink> = ({ href, SocialIcon }) => {
  return (
    <Link href={href} isExternal>
      <IconButton
        aria-label='Join our Discord Community'
        variant='ghost'
        icon={<SocialIcon />}
      />
    </Link>
  );
};
