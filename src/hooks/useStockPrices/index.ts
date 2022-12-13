import { useSelectStockPricesQuery } from '@/generated/graphql';
import { useMemo } from 'react';
import { gql } from 'urql';

// TODO: 売買代金

export const SelectStockPrices = gql`
  query selectStockPrices($where: stockIssues_bool_exp) {
    stockIssues(where: $where) {
      code
      stockPrices(order_by: { date: asc }) {
        stockIssueCode
        date
        open
        close
        high
        low
        volume
      }
    }
  }
`;

export type StockPriceEntry = {
  stockIssueCode: StockIssueCode;
  items: (StockPrice & {
    indicator: {
      sma1d: number;
      sma5w: number;
      sma13w: number;
      sma26w: number;
    };
  })[];
};

type StockPricesHookResult = {
  fetching: boolean;
  error?: Error;
  result: StockPriceEntry[];
};

export type StockPricesHook = (
  stockIssueCodes: StockIssueCode[]
) => StockPricesHookResult;

const useStockPrices: StockPricesHook = (stockIssueCodes) => {
  const where = useMemo(() => {
    if (!stockIssueCodes.length) return undefined;

    return {
      _or: stockIssueCodes.map((v) => ({
        code: { _eq: v },
      })),
    };
  }, [stockIssueCodes]);

  const [{ data, fetching, error }] = useSelectStockPricesQuery({
    pause: !where,
    variables: { where },
  });

  return useMemo(() => {
    if (!stockIssueCodes.length) {
      return {
        fetching: false,
        error,
        result: [],
      };
    }

    if (!data) {
      return {
        fetching,
        error,
        result: [],
      };
    }

    const { stockIssues } = data;

    const result = stockIssues.map<StockPriceEntry>((v) => ({
      stockIssueCode: v.code,
      items: v.stockPrices
        // TODO: #388
        .map((v2) => ({
          ...v2,
          high: v2.high ?? 0,
          low: v2.low ?? 0,
          open: v2.open ?? 0,
          close: v2.close ?? 0,
        }))
        .map((v2) => ({
          ...v2,
          date: new Date(v2.date),
          turnover: Math.round(v2.volume * (Math.random() + 1)), // TODO: テーブルから取得する
          indicator: {
            sma1d: Math.round(v2.close * 1.02), // TODO: テーブルから取得する
            sma5w: Math.round(v2.close * 1.05), // TODO: テーブルから取得する
            sma13w: Math.round(v2.close * 1.07), // TODO: テーブルから取得する
            sma26w: Math.round(v2.close * 1.1), // TODO: テーブルから取得する
          },
        })),
    }));

    return {
      fetching,
      error,
      result,
    };
  }, [data, error, fetching, stockIssueCodes.length]);
};

export default useStockPrices;
