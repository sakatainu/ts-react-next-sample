import {
  useDeleteGroupEventMutation,
  useInsertGroupEventMutation,
  useUpdateGroupEventMutation,
} from '@/generated/graphql';
import { useCallback, useMemo } from 'react';
import { gql } from 'urql';
import {
  dateString,
  GroupEventType,
  toEnum,
  uuidString,
} from '~/types/graphql';

export const DeleteGroupEvents = gql`
  mutation deleteGroupEvent($id: uuid!) {
    delete_groupEvents_by_pk(id: $id) {
      id
    }
  }
`;

export const UpdateGroupEvents = gql`
  mutation updateGroupEvent($id: uuid!, $set: groupEvents_set_input!) {
    update_groupEvents_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`;

export const InsertGroupEvents = gql`
  mutation insertGroupEvent($insert: groupEvents_insert_input!) {
    insert_groupEvents_one(object: $insert) {
      id
    }
  }
`;

type GroupEventId = string;

type GroupEventsRow = {
  date: DateTimeString;
  eventTypeCode: GroupEventType;
  memo: string;
  stockIssueCode: StockIssueCode;
};

type DispatchResult = {
  error?: Error;
};

type InsertDispatcher = (params: GroupEventsRow) => Promise<DispatchResult>;
type UpdateDispatcher = (
  id: GroupEventId,
  params: Partial<GroupEventsRow>
) => Promise<DispatchResult>;
type DeleteDispatcher = (id: GroupEventId) => Promise<DispatchResult>;

type UseGroupEventDispatcherHookResult = {
  insertDispatcher: InsertDispatcher;
  updateDispatcher: UpdateDispatcher;
  deleteDispatcher: DeleteDispatcher;
};

type UseGroupEventDispatcherHook = (
  groupId: GroupId
) => UseGroupEventDispatcherHookResult;

const useGroupEventDispatcher: UseGroupEventDispatcherHook = (groupId) => {
  const [, insertExecutor] = useInsertGroupEventMutation();
  const [, updateExecutor] = useUpdateGroupEventMutation();
  const [, deleteExecutor] = useDeleteGroupEventMutation();

  const insertDispatcher = useCallback<InsertDispatcher>(
    async (params) =>
      insertExecutor({
        insert: {
          ...params,
          groupId: uuidString(groupId),
          date: dateString(params.date),
          eventTypeCode: toEnum(params.eventTypeCode),
        },
      }),
    [groupId, insertExecutor]
  );

  const updateDispatcher = useCallback<UpdateDispatcher>(
    async (id, params) =>
      updateExecutor({
        id: uuidString(id),
        set: {
          ...params,
          groupId: uuidString(groupId),
          date: params.date ? dateString(params.date) : undefined,
          eventTypeCode: params.eventTypeCode && toEnum(params.eventTypeCode),
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

export default useGroupEventDispatcher;
