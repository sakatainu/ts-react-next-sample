import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Main = dynamic(() => import('~/components/page/SelectGroup'), {
  ssr: false,
});

const SelectGroup: NextPage = () => (
  <>
    <Head>
      <title>アカウント選択 - Hooolders</title>
    </Head>
    <Main />
  </>
);

export default SelectGroup;
