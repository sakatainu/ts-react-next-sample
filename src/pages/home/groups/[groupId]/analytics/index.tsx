import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Main = dynamic(() => import('~/components/page/Analytics'), {
  ssr: false,
});

const Analytics: NextPage = () => (
  <>
    <Head>
      <title>自社分析 - Hooolders</title>
    </Head>
    <Main />
  </>
);

export default Analytics;
