import { ChakraProvider, Stack } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { Navbar } from '@app/components/frame/Navbar';
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
      <Navbar />
      <Stack pt='20' pl='10' pr='10'>
        <Component {...pageProps} />
      </Stack>
    </ChakraProvider>
  );
}
