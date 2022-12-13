import {
  ArticleSources_Enum,
  Articles_Bool_Exp,
  Articles_Order_By,
  InputMaybe,
  Order_By,
  useSelectArticlesQuery,
} from '@/generated/graphql';
import { useMemo } from 'react';
import { gql } from 'urql';

export const SelectArticles = gql`
  query selectArticles(
    $limit: Int = 30
    $offset: Int = 0
    $orderBy: [articles_order_by!]!
    $where: articles_bool_exp
  ) {
    articlesAggregate: articles_aggregate(order_by: $orderBy, where: $where) {
      aggregate {
        count
      }
    }
    articles(
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
      id
      title
      timestamp
      path
      stockIssue {
        code
        name
      }
      articleSourceCode
      articleSource {
        code
      }
      articleContent {
        text
        articleContentKeywords {
          text
        }
        articleContentIncreaseKeywords {
          text
        }
        articleContentDecreaseKeywords {
          text
        }
      }
    }
  }
`;

const articleSourcesMap = {
  tanshin: '決算短信',
  yuuhou: '有価証券報告書',
  news_nikkei: '日経ニュース',
  news_prtimes: 'プレスリリース',
  other: 'その他IR',
} as const;

export type Article = {
  id: string;
  type: ArticleSources_Enum;
  distributor: {
    name: string;
  };
  about: {
    stockIssueCodes: StockIssueCode;
    name: string;
  };
  title: string;
  publishedAt: Date;
  sourceRef: string;
  content: string;
  increaseKeywords?: string[];
  decreaseKeywords?: string[];
};

type ArticlesHookResult =
  | {
      fetching: true;
      error?: undefined;
      result?: {
        value: Article[];
        totalCount: number;
      };
    }
  | {
      fetching: false;
      error: Error;
      result?: {
        value: Article[];
        totalCount: number;
      };
    }
  | {
      fetching: false;
      error: undefined;
      result: {
        value: Article[];
        totalCount: number;
      };
    };

export type ArticlesHook = (params: {
  condition?: {
    textQuery?: string;
    stockIssueCodes?: string[];
  };
  limit?: number;
  page?: number;
  orderBy?: Articles_Order_By | Articles_Order_By[];
}) => ArticlesHookResult;

const useArticles: ArticlesHook = ({
  condition,
  limit = 30,
  page = 1,
  orderBy = { timestamp: Order_By.Desc },
}) => {
  const where = useMemo<InputMaybe<Articles_Bool_Exp>>(() => {
    const andConditions: Articles_Bool_Exp[] = [];

    const textQuery = condition?.textQuery;
    if (textQuery) {
      let titleFiltersStr = textQuery.trim();
      titleFiltersStr = titleFiltersStr.replaceAll(
        String.EM_SPACE,
        String.SPACE
      );

      const titleFilters = titleFiltersStr
        .split(String.SPACE)
        .map<Articles_Bool_Exp>((v) => ({
          title: { _ilike: `%${v}%` },
        }));

      andConditions.push({ _and: titleFilters });
    }

    const stockIssueCodes = condition?.stockIssueCodes;
    if (stockIssueCodes?.length) {
      const stockIssueFilters = stockIssueCodes.map<Articles_Bool_Exp>((v) => ({
        stockIssueCode: { _eq: v },
      }));

      andConditions.push({ _or: stockIssueFilters });
    }

    if (!andConditions.length) return null;

    return { _and: andConditions };
  }, [condition?.stockIssueCodes, condition?.textQuery]);

  const [{ data, fetching, error }] = useSelectArticlesQuery({
    pause: !where,
    variables: {
      limit,
      offset: limit * (page - 1),
      orderBy,
      where,
    },
  });

  return useMemo<ArticlesHookResult>(() => {
    if (fetching) {
      return {
        fetching,
      };
    }

    if (error) {
      return {
        fetching,
        error,
      };
    }

    if (!data) {
      return {
        fetching,
        error: new Error('data is undefined'),
      };
    }

    if (!data.articlesAggregate.aggregate) {
      return {
        fetching,
        error: new Error('aggregate is undefined'),
      };
    }

    const { articles, articlesAggregate } = data;

    return {
      fetching,
      error,
      result: {
        value: articles.map<Article>((v) => ({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: v.id,
          type: v.articleSourceCode,
          distributor: {
            name: articleSourcesMap[v.articleSourceCode],
          },
          about: {
            stockIssueCodes: v.stockIssue.code,
            name: v.stockIssue.name,
          },
          title: v.title,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
          publishedAt: new Date(v.timestamp),
          sourceRef: v.path,
          content: v.articleContent?.text ?? '',
          increaseKeywords:
            v.articleContent?.articleContentIncreaseKeywords?.map(
              ({ text }) => text
            ),
          decreaseKeywords:
            v.articleContent?.articleContentDecreaseKeywords?.map(
              ({ text }) => text
            ),
        })),
        totalCount: articlesAggregate.aggregate?.count || 0,
      },
    };
  }, [data, error, fetching]);
};

export default useArticles;
