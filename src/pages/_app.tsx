import React, { useEffect, useState } from 'react';
import '@/scss/globals.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import Image from 'next/image';

import GeneralContainer from '@/components/Layout/GeneralContainer';

// redux
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

// components
import Loader from '@/components/Loader';
import MiniLoading from '@/components/MiniLoading';

import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  // Persistor
  const persistor = persistStore(store);

  // Loading function
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = (url: any) => setIsLoading(true);
  const handleComplete = (url: any) => setIsLoading(false);

  console.log(isLoading);

  
  useEffect(() => {

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Loader />}>
          {isLoading && <MiniLoading />}
          <GeneralContainer>
            <Component {...pageProps} />
          </GeneralContainer>
        </PersistGate>
      </Provider>
    </>
  );
}
