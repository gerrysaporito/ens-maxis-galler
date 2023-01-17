import { Box, Flex, IconButton, Link } from '@chakra-ui/react';
import { FaDiscord, FaTwitter, FaGlobe } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';

import { EnsMaxisLogo } from '../pure/EnsMaxisLogo';

const SOCIAL_LINKS = [
  {
    href: 'https://chat.ens.domains/',
    label: 'Join Discord',
    SocialIcon: FaDiscord,
  },
  {
    href: 'https://twitter.com/ENSMaxisNFT/',
    label: 'Follow on twitter',
    SocialIcon: FaTwitter,
  },
  {
    href: 'https://www.ensmaxis.com/',
    label: 'Learn more at the ENS Maxis site',
    SocialIcon: FaGlobe,
  },
];

export const Navbar: React.FC = () => {
  const socialLinks = SOCIAL_LINKS.map((meta, i) => (
    <SocialIconLink
      key={i}
      href={meta.href}
      SocialIcon={meta.SocialIcon}
      label={meta.label}
    />
  ));

  return (
    <Flex pt='5' pb='5' justifyContent='space-between' alignItems='center'>
      <Box width='10' height='10'>
        <EnsMaxisLogo />
      </Box>
      <Flex>{socialLinks}</Flex>
    </Flex>
  );
};

interface ISocialIconLink {
  href: string;
  label: string;
  SocialIcon: IconType;
}
const SocialIconLink: React.FC<ISocialIconLink> = ({
  href,
  SocialIcon,
  label,
}) => {
  return (
    <Link href={href} isExternal>
      <IconButton aria-label={label} variant='ghost' icon={<SocialIcon />} />
    </Link>
  );
};
