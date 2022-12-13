import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import useArticles from '~/hooks/useArticles';
import { useSearch } from '~/hooks/useSearch/index';
import useStockIssues from '~/hooks/useStockIssues';
import UserGroupProvider from '~/hooks/useGroup/UserGroupProvider';
import Template, { TemplateProps } from './Template';

const searchResultCountPerPage = 30;

export type NewsProps = {
  groupId: string;
  stockIssueCodes: StockIssueCode[];
  query: string;
  page?: number;
};

const Inner = ({
  stockIssueCodes,
  query: queryParam,
  page,
}: Omit<NewsProps, 'groupId'>) => {
  const router = useRouter();

  // global states
  const {
    fetching: stockIssuesLoading,
    error: stockIssuesError,
    result: stockIssues,
  } = useStockIssues();

  // selector states
  const [selectedStockIssues, setSelectedStockIssues] = useState<StockIssue[]>(
    []
  );

  // search state
  const [inputQueryValue, setInputQuery] = useState(queryParam);
  useEffect(() => setInputQuery(queryParam), [queryParam]);

  const {
    fetching: searchLoading,
    error: searchError,
    result: searchResult,
  } = useArticles({
    condition: {
      textQuery: queryParam,
      stockIssueCodes,
    },
    page,
    limit: searchResultCountPerPage,
  });

  // searchDialog state
  const [openStockSearchDialog, setOpenStockSearchDialog] = useState(false);
  const [stockSearchQuery, setSearchQuery] = useState('');
  const stockSearcher = useSearch(stockIssues ?? [], [
    'code',
    'name',
    'nameEn',
  ]);

  useEffect(() => {
    if (stockIssuesLoading || stockIssuesError) return;
    const stocksIndex = Object.fromEntries(stockIssues.map((v) => [v.code, v]));
    setSelectedStockIssues(stockIssueCodes.map((v) => stocksIndex[v]));
  }, [stockIssues, stockIssueCodes, stockIssuesLoading, stockIssuesError]);
  const [searchedStocks, setSearchedStocks] = useState<
    StockIssue[] | Promise<StockIssue[]>
  >([]);
  const { value: searchedStocksValue = [] } = useAsync(
    async () => searchedStocks,
    [searchedStocks]
  );

  const doSearch = useCallback(
    (query: string | undefined) => {
      delete router.query.query;

      if (query) {
        router.query = {
          groupId: router.query.groupId,
          stockIssueCodes: router.query.stockIssueCodes,
          query,
        };
      }

      document.body.focus();

      (async () => {
        await router.push(router);
      })();
    },
    [router]
  );

  const searchProps: TemplateProps['searchProps'] = {
    inputValue: inputQueryValue,
    onChangeQuery: (e) => setInputQuery(e.currentTarget.value),
    onSearch: (e) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const q = formData.get('searchQuery');

      doSearch(q?.toString());
    },
    onClickSearchKeyword: (e) => {
      const { keyword = '' } = e.currentTarget.dataset;

      const prevValue = inputQueryValue.trim();
      const newQuery = prevValue ? `${prevValue} ${keyword}` : keyword;

      doSearch(newQuery);
    },
  };

  const selectorProps: TemplateProps['selectorProps'] = {
    value: selectedStockIssues.map((v) => ({ id: v.code, label: v.name })),
    onClickAdd: () => {
      setSearchQuery('');
      setSearchedStocks([]);
      setOpenStockSearchDialog(true);
    },
    onClickItemDelete: (index) => {
      const restIds = [...stockIssueCodes];
      restIds.splice(index, 1);

      delete router.query.stockIssueCodes;
      if (restIds.length) {
        router.query.stockIssueCodes = restIds.join(',');
      }

      router.query.query = inputQueryValue;
      (async () => {
        await router.replace(router);
      })();
    },
  };

  const stockSearchDialogProps: TemplateProps['stockSearchDialogProps'] = {
    open: openStockSearchDialog,
    query: stockSearchQuery,
    searchResult: searchedStocksValue,
    onChangeQuery: (e) => {
      const q = e.currentTarget.value;
      setSearchQuery(e.currentTarget.value);

      setSearchedStocks(stockSearcher(q));
    },
    onClose: () => setOpenStockSearchDialog(false),
    onClickResultItem: (index) => {
      (async () => {
        const target = (await searchedStocks)[index];

        router.query.stockIssueCodes = [...stockIssueCodes, target.code].join(
          ','
        );
        router.query.query = inputQueryValue;
        delete router.query.page;

        await router.push(router);
        setOpenStockSearchDialog(false);
      })();
    },
  };

  const searchResultValue = useMemo<
    TemplateProps['searchResultProps']['result']
  >(() => {
    if (searchLoading || searchError) return undefined;

    return {
      ...searchResult,
      page: page ?? 1,
      pageCount:
        Math.ceil(searchResult.totalCount / searchResultCountPerPage) || 1,
      onChangePage: (_, nextPage) => {
        router.query.page = nextPage.toString();
        (async () => {
          await router.push(router);
        })();
      },
    };
  }, [page, router, searchError, searchLoading, searchResult]);

  const searchResultProps: TemplateProps['searchResultProps'] = {
    showResult: Boolean(queryParam) || Boolean(stockIssueCodes.length),
    loading: searchLoading,
    error: Boolean(searchError),
    result: searchResultValue,
  };

  return (
    <Template
      selectorProps={selectorProps}
      searchProps={searchProps}
      searchResultProps={searchResultProps}
      stockSearchDialogProps={stockSearchDialogProps}
    />
  );
};

const News = ({
  groupId,
  stockIssueCodes: symbols,
  query,
  page,
}: NewsProps) => (
  <UserGroupProvider
    groupId={groupId}
    fallback={<Typography>企業アカウントが有効ではありません。</Typography>}
  >
    <Inner stockIssueCodes={symbols} query={query} page={page} />
  </UserGroupProvider>
);

export default News;
