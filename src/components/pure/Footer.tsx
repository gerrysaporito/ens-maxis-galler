import { Flex, Link, Text } from '@chakra-ui/react';

import { PERSONAL_TWITTER } from '@app/interface/routes';

export const Footer: React.FC = () => {
  return (
    <Flex
      justifyContent='center'
      alignItems='center'
      pt='20'
      pb='20'
      backgroundImage='linear-gradient(90deg, #52E1FF 0%, #5442FC 100%)'
      backgroundSize='cover'
      backgroundRepeat='no-repeat'
    >
      <Flex justifyContent='center' flexDirection='column' textAlign='center'>
        <Text>Made with ❤️ in California by a fellow ENS Maxi.</Text>
        <Text>
          Want to show appreciation?{' '}
          <Link isExternal href={PERSONAL_TWITTER}>
            Tweet at me{' '}
          </Link>{' '}
          or send me a Maxi @ Saporito.eth
        </Text>
      </Flex>
    </Flex>
  );
};
