import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import useUrlQuery from '~/hooks/useUrlQuery';

const Main = dynamic(() => import('~/components/page/News'), { ssr: false });

const News: NextPage = () => {
  const {
    groupId: groupIdParam = [],
    stockIssueCodes: stockIssueCodesParam = [],
    query: queryParam = [],
    page: pageParam = [],
  } = useUrlQuery();

  const groupId = groupIdParam[0];
  const stockIssueCodes = stockIssueCodesParam
    .flatMap((v) => v.split(','))
    .filter((v) => v);
  const query = queryParam.join(' ');
  const parsedPage = Number.parseInt(pageParam[0], 10);
  const page = Number.isNaN(parsedPage) ? undefined : parsedPage;

  return (
    <>
      <Head>
        <title>ニュース検索 - Hooolders</title>
      </Head>
      <Main
        groupId={groupId}
        stockIssueCodes={stockIssueCodes}
        query={query}
        page={page}
      />
    </>
  );
};

export default News;
