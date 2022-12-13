import { useSelectGroupStockIssueListQuery } from '@/generated/graphql';
import { useMemo } from 'react';
import { gql } from 'urql';
import {
  GroupListedStockIssueId,
  GroupStockIssueListId,
  uuidString,
} from '~/types/graphql';

export const SelectGroupStockIssueLists = gql`
  query selectGroupStockIssueList($where: groupStockIssueLists_bool_exp) {
    groupStockIssueLists(where: $where, order_by: { name: asc }) {
      id
      groupId
      name
      items: groupListedStockIssues(order_by: { stockIssueCode: asc }) {
        id
        stockIssueCode
        stockIssue {
          code
          name
        }
      }
    }
  }
`;

export type GroupListedStockIssue = {
  id: GroupListedStockIssueId;
  stockIssue: StockIssue;
};

export type GroupStockIssueList = {
  id: GroupStockIssueListId;
  groupId: GroupId;
  name: string;
  items: GroupListedStockIssue[];
};

type GroupStockIssueListHookResult = {
  fetching: boolean;
  error?: Error;
  result?: {
    value: GroupStockIssueList[];
  };
};

export type GroupStockIssueListHook = (
  groupId: GroupId,
  groupListedStockIssueId?: GroupListedStockIssueId
) => GroupStockIssueListHookResult;

const useGroupStockIssueLists: GroupStockIssueListHook = (groupId, id) => {
  const groupIdValue = uuidString(groupId);
  const idValue = id ? uuidString(id) : undefined;

  const [{ data, fetching, error }] = useSelectGroupStockIssueListQuery({
    variables: {
      where: {
        groupId: { _eq: groupIdValue },
        ...(idValue && {
          id: {
            _eq: idValue,
          },
        }),
      },
    },
  });

  const result = useMemo(() => {
    if (!data) return undefined;

    return {
      value: data.groupStockIssueLists,
    };
  }, [data]);

  return useMemo<GroupStockIssueListHookResult>(
    () => ({
      fetching,
      error,
      result,
    }),
    [error, fetching, result]
  );
};

export default useGroupStockIssueLists;
