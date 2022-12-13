import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Main = dynamic(() => import('~/components/page/Login'), {
  ssr: false,
});

const Index: NextPage = () => (
  <>
    <Head>
      <title>ログイン - Hooolders</title>
    </Head>
    <Main />
  </>
);

export default Index;
