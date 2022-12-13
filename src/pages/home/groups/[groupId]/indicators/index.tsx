import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Main = dynamic(() => import('~/components/page/Indicators'), {
  ssr: false,
});

const Indicators: NextPage = () => (
  <>
    <Head>
      <title>指標比較 - Hooolders</title>
    </Head>
    <Main />
  </>
);

export default Indicators;
