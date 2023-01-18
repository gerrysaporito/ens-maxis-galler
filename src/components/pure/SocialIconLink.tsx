import { IconButton, Link } from '@chakra-ui/react';
import type { IconType } from 'react-icons/lib';

interface ISocialIconLink {
  href: string;
  label: string;
  fontSize?: string;
  SocialIcon: IconType;
}
export const SocialIconLink: React.FC<ISocialIconLink> = ({
  href,
  SocialIcon,
  label,
  fontSize,
}) => {
  return (
    <Link href={href} isExternal>
      <IconButton
        fontSize={fontSize ?? 'md'}
        aria-label={label}
        variant='ghost'
        icon={<SocialIcon />}
      />
    </Link>
  );
};
