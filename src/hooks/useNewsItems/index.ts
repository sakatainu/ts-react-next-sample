import {
  ArticleSources_Enum,
  Articles_Bool_Exp,
  InputMaybe,
  useSelectNewsItemsQuery,
  UuidString,
} from '@/generated/graphql';
import { useMemo } from 'react';
import { gql } from 'urql';
import { gqlString, GroupEventType, groupEventTypeMap } from '~/types/graphql';

// TODO: 以下に対応させる
// ページネーション
// 日付によるフィルタリング
// HACK

export const SelectNewsItems = gql`
  query selectNewsItems($groupId: uuid, $where: articles_bool_exp) {
    groups(where: { id: { _eq: $groupId } }) {
      groupEvents(order_by: { date: desc }) {
        id
        eventTypeCode
        eventType {
          code
        }
        memo
        date
        stockIssue {
          code
          name
        }
      }
    }
    articles(order_by: { timestamp: desc }, where: $where) {
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
    }
  }
`;

const articleSourceMap = {
  tanshin: '決算短信',
  yuuhou: '有価証券報告書',
  news_nikkei: '日経ニュース',
  news_prtimes: 'プレスリリース',
  other: 'その他IR',
} as const;

export type NewsItemType = `${ArticleSources_Enum}` | GroupEventType;
export type CategoryType = 'news' | 'ir' | 'groupEvent';

export type NewsItem = {
  id: string;
  category: {
    value: CategoryType;
    label: string;
  };
  type: {
    value: NewsItemType;
    label: string;
  };
  about: {
    stockIssueCode: StockIssueCode;
    name: string;
  };
  timestamp: Date;
  description: string;
  sourceRef?: string;
  status: {
    roc1d: number;
    roc5d: number;
    stockImpact: number;
    volumeImpact: number;
  };
};

const getCategory = (
  value: ArticleSources_Enum
): {
  value: CategoryType;
  label: string;
} => {
  switch (value) {
    case ArticleSources_Enum.NewsNikkei:
    case ArticleSources_Enum.NewsPrtimes:
      return { value: 'news', label: 'ニュース' };
    case ArticleSources_Enum.Yuuhou:
    case ArticleSources_Enum.Tanshin:
    case ArticleSources_Enum.Other:
    default:
      return { value: 'ir', label: 'IR' };
  }
};

export type NewsItemsHookResult = {
  fetching: boolean;
  error?: Error;
  result: {
    values: NewsItem[];
  };
};

export type NewsItemsHook = (
  groupId: GroupId,
  params: {
    condition?: {
      stockIssueCodes?: StockIssueCode[];
    };
  }
) => NewsItemsHookResult;

const useNewsItems: NewsItemsHook = (groupId, { condition }) => {
  const where = useMemo<InputMaybe<Articles_Bool_Exp>>(() => {
    const andConditions: Articles_Bool_Exp[] = [];
    const stockIssueCodes = condition?.stockIssueCodes;
    if (stockIssueCodes?.length) {
      const stockIssueFilters = stockIssueCodes.map<Articles_Bool_Exp>((v) => ({
        stockIssueCode: { _eq: v },
      }));

      andConditions.push({ _or: stockIssueFilters });
    }

    if (!andConditions.length) return null;

    return { _and: andConditions };
  }, [condition?.stockIssueCodes]);

  const [{ data, fetching, error }] = useSelectNewsItemsQuery({
    pause: !where,
    variables: {
      groupId: gqlString<UuidString>(groupId),
      where,
    },
  });

  const result = useMemo(() => {
    if (!data) return { values: [] };

    const articles = data.articles.map<NewsItem>((v) => ({
      id: v.id,
      category: getCategory(v.articleSourceCode),
      isArticle: true,
      type: {
        value: v.articleSourceCode,
        label: articleSourceMap[v.articleSourceCode],
      },
      about: {
        stockIssueCode: v.stockIssue.code,
        name: v.stockIssue.name,
      },
      timestamp: new Date(v.timestamp),
      description: v.title,
      sourceRef: v.path,
      status: {
        roc1d: Math.random(),
        roc5d: Math.random(),
        stockImpact: Math.random(),
        volumeImpact: Math.random(),
      },
    }));

    const groupEvents = data.groups.flatMap(({ groupEvents: ge }) =>
      ge.map<NewsItem>((v) => ({
        id: v.id,
        category: {
          value: 'groupEvent',
          label: '登録イベント',
        },
        type: {
          value: v.eventTypeCode,
          label: groupEventTypeMap[v.eventTypeCode],
        },
        about: {
          stockIssueCode: v.stockIssue.code,
          name: v.stockIssue.name,
        },
        timestamp: new Date(v.date),
        description: v.memo,
        status: {
          roc1d: Math.random(),
          roc5d: Math.random(),
          stockImpact: Math.random(),
          volumeImpact: Math.random(),
        },
      }))
    );

    const newsItems = articles
      .concat(groupEvents)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return {
      values: newsItems,
    };
  }, [data]);

  return useMemo<NewsItemsHookResult>(
    () => ({
      fetching,
      error,
      result,
    }),
    [error, fetching, result]
  );
};

export default useNewsItems;
