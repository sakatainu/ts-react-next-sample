import { useCallback, useMemo } from 'react';
import useGroupListedStockIssuesDispatcher from '~/hooks/useGroupListedStockIssuesDispatcher';
import useGroupStockIssueListDispatcher from '~/hooks/useGroupStockIssueListDispatcher';
import {
  GroupListedStockIssueId,
  GroupStockIssueListId,
} from '~/types/graphql';

export type InputGroupListedStockIssue = {
  id?: GroupListedStockIssueId;
  stockIssueCode: StockIssueCode;
};

export type InputGroupStockIssueList = {
  id: GroupStockIssueListId;
  name: string;
  items: InputGroupListedStockIssue[];
};

type DispatchResult<T = unknown> = {
  error?: Error;
  data?: T;
};

type UpdateDispatcher = (
  value: InputGroupStockIssueList
) => Promise<DispatchResult>;

type CreateDispatcher = (
  value: Omit<InputGroupStockIssueList, 'id'>
) => Promise<
  DispatchResult<{
    groupStockIssueListId: string;
  }>
>;

type DeleteDispatcher = (
  value: GroupStockIssueListId
) => Promise<DispatchResult>;

type UseWatchlistResult = {
  updateDispatcher: UpdateDispatcher;
  createDispatcher: CreateDispatcher;
  deleteDispatcher: DeleteDispatcher;
};

type UseWatchFolder = (groupId: GroupId) => UseWatchlistResult;

const useWatchFolder: UseWatchFolder = (groupId) => {
  const {
    insertDispatcher: insertStockIssueList,
    updateDispatcher: updateStockIssueList,
    deleteDispatcher: deleteStockIssueList,
  } = useGroupStockIssueListDispatcher(groupId);
  const {
    insertDispatcher: insertListedStockIssue,
    deleteDispatcher: deleteListedStockIssue,
  } = useGroupListedStockIssuesDispatcher();

  const doInsertListedStockIssue = useCallback(
    async (id: string, value: InputGroupListedStockIssue[]) => {
      const insertParam = value.map((item) => ({
        groupStockIssueListId: id,
        stockIssueCode: item.stockIssueCode,
      }));
      const { error: error2 } = await insertListedStockIssue(insertParam);

      if (error2) {
        const message = `Failed to insert groupStockIssueListId: "${id}" in groupListedStockIssue.`;
        return {
          error: new Error(message, { cause: error2 }),
        };
      }

      return {};
    },
    [insertListedStockIssue]
  );

  const createDispatcher = useCallback<CreateDispatcher>(
    async (value) => {
      const { error: error1, data } = await insertStockIssueList({
        name: value.name,
      });

      if (error1 || !data) {
        const message = `Failed to insert "${value.name}" in groupStockIssueList.`;
        return {
          error: new Error(message, { cause: error1 }),
        };
      }

      const insertResult = await doInsertListedStockIssue(data.id, value.items);
      if (insertResult.error) return insertResult;

      return {
        data: {
          groupStockIssueListId: data.id,
        },
      };
    },
    [doInsertListedStockIssue, insertStockIssueList]
  );

  const updateDispatcher = useCallback<UpdateDispatcher>(
    async (value) => {
      const { error: error1 } = await updateStockIssueList(value.id, {
        name: value.name,
      });

      if (error1) {
        const message = `Failed to update "${value.name}" in groupStockIssueList.`;
        return { error: new Error(message, { cause: error1 }) };
      }

      const { error: error2 } = await deleteListedStockIssue(value.id);
      if (error2) {
        const message = `Failed to delete "${value.id}" in groupListedStockIssue.`;
        return { error: new Error(message, { cause: error2 }) };
      }

      return doInsertListedStockIssue(value.id, value.items);
    },
    [deleteListedStockIssue, doInsertListedStockIssue, updateStockIssueList]
  );

  const deleteDispatcher = useCallback<DeleteDispatcher>(
    async (value) => deleteStockIssueList(value),
    [deleteStockIssueList]
  );

  return useMemo(
    () => ({
      createDispatcher,
      updateDispatcher,
      deleteDispatcher,
    }),
    [createDispatcher, updateDispatcher, deleteDispatcher]
  );
};

export default useWatchFolder;
