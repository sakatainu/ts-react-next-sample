import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Main = dynamic(() => import('~/components/page/Staffs'), {
  ssr: false,
});

const Staffs: NextPage = () => (
  <>
    <Head>
      <title>スタッフ管理 - Hooolders</title>
    </Head>
    <Main />
  </>
);

export default Staffs;
