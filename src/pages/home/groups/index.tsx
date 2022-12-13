import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Main = dynamic(() => import('~/components/page/Groups'), {
  ssr: false,
});

const Groups: NextPage = () => (
  <>
    <Head>
      <title>アカウント管理 - Hooolders</title>
    </Head>
    <Main />
  </>
);

export default Groups;
