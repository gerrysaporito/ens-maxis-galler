import { ChakraProvider, Flex, Stack } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { Navbar } from '@app/components/frame/Navbar';
import { Footer } from '@app/components/pure/Footer';
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
  return (
    <ChakraProvider>
      <Stack
      // backgroundImage='linear-gradient(90deg, #52E1FF 0%, #5442FC 100%)'
      // backgroundSize='cover'
      // backgroundRepeat='no-repeat'
      >
        <Flex justifyContent='center'>
          <Stack w='90%' maxW='1250px'>
            <Navbar />
            <Component {...pageProps} />
          </Stack>
        </Flex>
        <Footer />
      </Stack>
    </ChakraProvider>
  );
}
