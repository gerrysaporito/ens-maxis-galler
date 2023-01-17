import { ChakraProvider, Flex, Stack } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { Navbar } from '@app/components/frame/Navbar';
import { useIsMobile } from '@app/hooks/useIsMobile';
import LocalStorage from '@app/models/LocalStorage';

const initializeLocalStorage = () => {
  if (typeof window !== 'undefined') {
    // Check if storage is supported.
    let storageSupported = false;
    try {
      storageSupported = !!window.localStorage;
    } catch (e) {}

    // If not supported, replace localStorage and sessionStorage to in-memory map storage.
    if (!storageSupported) {
      Object.defineProperty(window, 'localStorage', new LocalStorage());
      Object.defineProperty(window, 'sessionStorage', new LocalStorage());
    }
  }
};

initializeLocalStorage();

export default function App({ Component, pageProps }: AppProps) {
  const { isMobile } = useIsMobile();

  return (
    <ChakraProvider>
      <Flex justifyContent='center'>
        <Stack w='80%' maxW={isMobile ? '80%' : '90%'}>
          <Navbar />
          <Component {...pageProps} />
        </Stack>
      </Flex>{' '}
    </ChakraProvider>
  );
}
