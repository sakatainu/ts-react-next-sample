import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Main = dynamic(() => import('~/components/page/ResetPassword'), {
  ssr: false,
});

const Login: NextPage = () => (
  <>
    <Head>
      <title>パスワードリセット - Hooolders</title>
    </Head>
    <Main />
  </>
);

export default Login;
