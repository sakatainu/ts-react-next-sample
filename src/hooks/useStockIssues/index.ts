import { useSelectStockIssuesQuery } from '@/generated/graphql';
import { useMemo } from 'react';
import { gql } from 'urql';
import useEffectRef from '~/hooks/useEffectRef';

export const SelectStockIssues = gql`
  query selectStockIssues {
    stockIssues {
      code
      name
    }
  }
`;

type StockIssueHookResult = {
  fetching: boolean;
  error?: Error;
  result: StockIssue[];
};

export type StockIssueHook = (option?: {
  filter?: (value: StockIssue, index: number, array: StockIssue[]) => boolean;
}) => StockIssueHookResult;

const useStockIssues: StockIssueHook = (option) => {
  const filterOption = option?.filter;
  const paramRef = useEffectRef({ filterOption });

  const [{ fetching, error, data }] = useSelectStockIssuesQuery();

  return useMemo<StockIssueHookResult>(() => {
    if (fetching) {
      return {
        fetching,
        result: [],
      };
    }
    if (error) {
      return {
        fetching,
        error,
        result: [],
      };
    }
    if (!data) {
      return {
        fetching,
        error: new Error('data is undefined'),
        result: [],
      };
    }

    const { stockIssues } = data;

    const result = stockIssues
      .map<StockIssue>((v) => ({
        code: v.code,
        name: v.name,
      }))
      .filter(paramRef.current.filterOption ?? (() => true));

    return {
      fetching,
      error,
      result,
    };
  }, [data, error, fetching, paramRef]);
};

export default useStockIssues;
