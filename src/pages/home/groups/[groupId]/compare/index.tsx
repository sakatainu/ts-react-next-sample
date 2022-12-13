import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import useUrlQuery from '~/hooks/useUrlQuery';
import { distinct } from '~/utils';

const Main = dynamic(() => import('~/components/page/Compare'), {
  ssr: false,
});

const Compare: NextPage = () => {
  const { id: idParam = [], compares: comparesParam = [] } = useUrlQuery();

  const id = idParam.at(0);
  const compares = comparesParam.flatMap((v) => v.split(',')).filter((v) => v);
  const distinctCompares = distinct(compares);

  return (
    <>
      <Head>
        <title>企業比較 - Hooolders</title>
      </Head>
      <Main id={id} compares={distinctCompares} />
    </>
  );
};

export default Compare;
