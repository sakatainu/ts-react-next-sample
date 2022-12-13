import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Main = dynamic(() => import('~/components/page/GroupMembers'), {
  ssr: false,
});

const Members: NextPage = () => (
  <>
    <Head>
      <title>ユーザー管理 - Hooolders</title>
    </Head>
    <Main />
  </>
);

export default Members;
