import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
// import useUrlQuery from '~/hooks/useUrlQuery';

const Main = dynamic(() => import('~/components/page/Profile'), { ssr: false });

const Profile: NextPage = () => (
  <>
    <Head>
      <title>プロフィール管理 - Hooolders</title>
    </Head>
    <Main />
  </>
);

export default Profile;
