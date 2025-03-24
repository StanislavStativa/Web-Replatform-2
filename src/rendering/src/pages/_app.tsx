import type { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import Script from 'next/script';
import { SitecorePageProps } from 'lib/page-props';
import { Provider } from 'jotai';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useMemo, useState } from 'react';
import localFont from 'next/font/local';
import '@/styles/global.css';
import { Configuration } from 'ordercloud-javascript-sdk';
import { OpenAPI } from '@/api';
import Cookies from 'js-cookie';
import 'react-responsive-modal/styles.css';
import { AUTH_TOKEN, CUST_ID, SITE_ID, USR_EMAIL, WECO_AUTH_TOKEN } from '@/config';
import { useRouter } from 'next/router';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import useLocalStorage from '@/utils/useLocalStorage';
import LogRocket from 'logrocket';
import CustomErrorBoundary from '@/components/ErrorBoundary';
OpenAPI.BASE = process.env.NEXT_PUBLIC_MIDDLEWARE_API_URL as string;

const bemboFont = localFont({
  src: '../fonts/BemboStd-400.ttf',
  variable: '--bemboStd',
});

const bemboSemibold = localFont({
  src: '../fonts/BemboStd-600.ttf',
  variable: '--bemboStdSemiBold',
});

const bemboStdBold = localFont({
  src: '../fonts/BemboStd-700.ttf',
  variable: '--bemboStdBold',
});

const latoLight = localFont({
  src: '../fonts/Lato-Light.ttf',
  variable: '--latoLight',
});

const latoRegular = localFont({
  src: '../fonts/Lato-Regular.ttf',
  variable: '--latoRegular',
});

const latoSemiBold = localFont({
  src: '../fonts/Lato-SemiBold.ttf',
  variable: '--latoSemiBold',
});

const latoBold = localFont({
  src: '../fonts/Lato-Bold.ttf',
  variable: '--latoBold',
});

function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const { getData, removeData, getSessionData, setSessionData } = useLocalStorage();
  const isLogout = getData<boolean>('logout');
  const [isLoading, setIsLoading] = useState(false);
  const { dictionary, ...rest } = pageProps;
  // const authToken = Cookies.get(AUTH_TOKEN);
  const logAppId = process.env.NEXT_PUBLIC_LOG_ROCKET_APP_ID;

  const customerId = Cookies.get(CUST_ID);
  const userEmail = getData<string>(USR_EMAIL);
  const asPath = getSessionData('tts_asPath');
  Configuration.Set({
    baseApiUrl: process.env.NEXT_PUBLIC_ORDERCLOUD_API_ENDPOINT as string,
  });
  OpenAPI.BASE = process.env.NEXT_PUBLIC_MIDDLEWARE_API_URL as string;
  OpenAPI.HEADERS = {
    Authorization: `Bearer ${Cookies.get(AUTH_TOKEN)}`,
    wckoToken: `${Cookies.get(WECO_AUTH_TOKEN)}`,
    siteId: `${Cookies.get(SITE_ID)}`,
  };

  const fontClasses = useMemo(
    () =>
      `${bemboFont.variable} ${bemboSemibold.variable} ${bemboStdBold.variable} ${latoRegular.variable} ${latoSemiBold.variable} ${latoBold.variable} ${latoLight.variable}`,
    []
  );

  // useEffect(() => {
  //   //In case user clear cookie manually(Bug-17217)
  //   if (authToken === null || authToken === undefined) {
  //     router.replace('/');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [authToken]);

  //Canonical url formation
  useEffect(() => {
    if (asPath !== router.asPath) {
      setSessionData('tts_asPath', router.asPath);
    } else if (asPath === null || asPath === undefined) {
      setSessionData('tts_asPath', router.asPath);
    }
  }, [router.asPath, asPath]);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Cleanup the event listeners when the component is unmounted
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(() => {
    //Post logout and user of basePath, Manually triggering reload to reset cache
    if (isLogout && isLogout !== undefined && isLogout === true) {
      removeData('logout');
      setTimeout(() => {
        router.reload();
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogout, router]);

  useEffect(() => {
    if (logAppId && logAppId !== undefined) {
      LogRocket?.init(logAppId as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (logAppId && logAppId !== undefined && customerId && userEmail) {
    LogRocket?.identify(customerId as string, {
      email: userEmail as string,
    });
  }

  return (
    <div className={fontClasses}>
      <CustomErrorBoundary>
        <Script
          async
          defer
          id="pinterest"
          strategy="lazyOnload"
          src="https://assets.pinterest.com/js/pinit.js"
          data-pin-hover="true"
        />

        {/*
        // Use the next-localization (w/ rosetta) library to provide our translation dictionary to the app.
        // Note Next.js does not (currently) provide anything for translation, only i18n routing.
        // If your app is not multilingual, next-localization and references to it can be removed.
      */}
        <QueryClientProvider client={queryClient}>
          <div className="print:hidden">
            <ReactQueryDevtools initialIsOpen={false} />
          </div>
          <HydrationBoundary state={pageProps.dehydratedState}>
            <I18nProvider lngDict={dictionary} locale={pageProps.locale}>
              <Provider>
                {isLoading && <LoaderSpinner />}
                <Component {...rest} />
              </Provider>
            </I18nProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </CustomErrorBoundary>
    </div>
  );
}

export default App;
