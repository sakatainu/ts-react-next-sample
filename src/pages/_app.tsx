import { EmotionCache } from '@emotion/react';
import { AppProps as BaseAppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { theme } from '~/configs';
import createEmotionCache from '~/configs/createEmotionCache';

const Main = dynamic(() => import('~/components/App/Main'), { ssr: false });

export type AppProps = BaseAppProps & {
  emotionCache?: EmotionCache;
};

const App = ({
  Component,
  emotionCache = createEmotionCache(),
  pageProps,
}: AppProps) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <meta name="theme-color" content={theme.palette.primary.main} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="app-release" content={$env.APP_RELEASE} />
      <link rel="shortcut icon" href="/favicon.ico" />
      <title>Hooolders Analytics</title>
    </Head>

    <Main emotionCache={emotionCache}>
      <Component {...pageProps} />
    </Main>
  </>
);

export default App;
