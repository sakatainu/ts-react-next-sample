import {
  useDeleteGroupListedStockIssuesMutation,
  useInsertGroupListedStockIssuesMutation,
} from '@/generated/graphql';
import { useCallback, useMemo } from 'react';
import { gql } from 'urql';
import { GroupStockIssueListId, uuidString } from '~/types/graphql';

export const InsertGroupListedStockIssues = gql`
  mutation insertGroupListedStockIssues(
    $insert: [groupListedStockIssues_insert_input!]!
  ) {
    insert_groupListedStockIssues(objects: $insert) {
      returning {
        id
      }
    }
  }
`;

export const DeleteGroupListedStockIssues = gql`
  mutation deleteGroupListedStockIssues($groupStockIssueListId: uuid!) {
    delete_groupListedStockIssues(
      where: { groupStockIssueListId: { _eq: $groupStockIssueListId } }
    ) {
      returning {
        id
      }
    }
  }
`;

type GroupListedStockIssueRow = {
  groupStockIssueListId: GroupStockIssueListId;
  stockIssueCode: StockIssueCode;
};

type DispatchResult = {
  error?: Error;
};

type InsertDispatcher = (
  params: GroupListedStockIssueRow[]
) => Promise<DispatchResult>;
type DeleteDispatcher = (
  groupStockIssueListId: GroupStockIssueListId
) => Promise<DispatchResult>;

type UseGroupListedStockIssuesDispatcherResult = {
  insertDispatcher: InsertDispatcher;
  deleteDispatcher: DeleteDispatcher;
};

type UseGroupListedStockIssuesDispatcherHook =
  () => UseGroupListedStockIssuesDispatcherResult;

const useGroupListedStockIssuesDispatcher: UseGroupListedStockIssuesDispatcherHook =
  () => {
    const [, insertExecutor] = useInsertGroupListedStockIssuesMutation();
    const [, deleteExecutor] = useDeleteGroupListedStockIssuesMutation();

    const insertDispatcher = useCallback<InsertDispatcher>(
      async (params) =>
        insertExecutor({
          insert: params.map((v) => ({
            ...v,
            groupStockIssueListId: uuidString(v.groupStockIssueListId),
          })),
        }),
      [insertExecutor]
    );

    const deleteDispatcher = useCallback<DeleteDispatcher>(
      async (groupStockIssueListId) =>
        deleteExecutor({
          groupStockIssueListId: uuidString(groupStockIssueListId),
        }),
      [deleteExecutor]
    );

    return useMemo(
      () => ({
        insertDispatcher,
        deleteDispatcher,
      }),
      [deleteDispatcher, insertDispatcher]
    );
  };

export default useGroupListedStockIssuesDispatcher;
