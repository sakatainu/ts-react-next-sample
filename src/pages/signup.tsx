import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import useUrlQuery from '~/hooks/useUrlQuery';

const Main = dynamic(() => import('~/components/page/Signup'), {
  ssr: false,
});

const Signup: NextPage = () => {
  const { email: emailParam = [] } = useUrlQuery();

  const email = emailParam.at(0);

  return (
    <>
      <Head>
        <title>サインアップ - Hooolders</title>
      </Head>
      <Main
        defaultValue={{
          email,
        }}
      />
    </>
  );
};

export default Signup;
