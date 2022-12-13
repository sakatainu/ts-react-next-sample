import {
  useDeleteGroupStockIssueListsMutation,
  useInsertGroupStockIssueListsMutation,
  useUpdateGroupStockIssueListsMutation,
} from '@/generated/graphql';
import { useCallback, useMemo } from 'react';
import { gql } from 'urql';
import { GroupStockIssueListId, uuidString } from '~/types/graphql';

export const DeleteGroupStockIssueLists = gql`
  mutation deleteGroupStockIssueLists($id: uuid!) {
    delete_groupStockIssueLists_by_pk(id: $id) {
      id
    }
  }
`;

export const UpdateGroupStockIssueLists = gql`
  mutation updateGroupStockIssueLists(
    $id: uuid!
    $set: groupStockIssueLists_set_input!
  ) {
    update_groupStockIssueLists_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`;

export const InsertGroupStockIssueLists = gql`
  mutation insertGroupStockIssueLists(
    $insert: groupStockIssueLists_insert_input!
  ) {
    insert_groupStockIssueLists_one(object: $insert) {
      id
    }
  }
`;

type GroupStockIssueListRow = {
  name: string;
};

type DispatchResult<T = unknown> = {
  error?: Error;
  data?: T;
};

type InsertDispatcher = (params: GroupStockIssueListRow) => Promise<
  DispatchResult<{
    id: GroupStockIssueListId;
  }>
>;
type UpdateDispatcher = (
  id: GroupStockIssueListId,
  params: Partial<GroupStockIssueListRow>
) => Promise<DispatchResult>;
type DeleteDispatcher = (id: GroupStockIssueListId) => Promise<DispatchResult>;

type UseGroupStockIssueListDispatcherResult = {
  insertDispatcher: InsertDispatcher;
  updateDispatcher: UpdateDispatcher;
  deleteDispatcher: DeleteDispatcher;
};

type UseGroupStockIssueListDispatcherHook = (
  groupId: GroupId
) => UseGroupStockIssueListDispatcherResult;

const useGroupStockIssueListDispatcher: UseGroupStockIssueListDispatcherHook = (
  groupId
) => {
  const [, insertExecutor] = useInsertGroupStockIssueListsMutation();
  const [, updateExecutor] = useUpdateGroupStockIssueListsMutation();
  const [, deleteExecutor] = useDeleteGroupStockIssueListsMutation();

  const insertDispatcher = useCallback<InsertDispatcher>(
    async (params) => {
      const { error, data } = await insertExecutor({
        insert: {
          ...params,
          groupId: uuidString(groupId),
        },
      });

      return {
        error,
        ...(data?.insert_groupStockIssueLists_one && {
          data: {
            id: data.insert_groupStockIssueLists_one.id,
          },
        }),
      };
    },
    [groupId, insertExecutor]
  );

  const updateDispatcher = useCallback<UpdateDispatcher>(
    async (id, params) =>
      updateExecutor({
        id: uuidString(id),
        set: {
          ...params,
          groupId: uuidString(groupId),
        },
      }),
    [groupId, updateExecutor]
  );

  const deleteDispatcher = useCallback<DeleteDispatcher>(
    async (id) => deleteExecutor({ id: uuidString(id) }),
    [deleteExecutor]
  );

  return useMemo(
    () => ({
      insertDispatcher,
      updateDispatcher,
      deleteDispatcher,
    }),
    [deleteDispatcher, insertDispatcher, updateDispatcher]
  );
};

export default useGroupStockIssueListDispatcher;
