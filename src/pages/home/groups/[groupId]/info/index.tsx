import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Main = dynamic(() => import('~/components/page/GroupInfo'), {
  ssr: false,
});

const Indicators: NextPage = () => (
  <>
    <Head>
      <title>企業アカウント - Hooolders</title>
    </Head>
    <Main />
  </>
);

export default Indicators;
