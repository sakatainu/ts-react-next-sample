import {
  DeleteStaffByIdMutation,
  InsertStaffInvitationMutation,
  useDeleteStaffByIdMutation,
  useInsertStaffInvitationMutation,
} from '@/generated/graphql';
import { useCallback, useMemo } from 'react';
import { gql } from 'urql';
import { uuidString } from '~/types/graphql';

export const InsertStaffInvitations = gql`
  mutation insertStaffInvitation($object: staffs_insert_input!) {
    insert_staffs_one(object: $object) {
      id
    }
  }
`;

export const DeleteStaffById = gql`
  mutation deleteStaffById($id: uuid!) {
    delete_staffs_by_pk(id: $id) {
      id
    }
  }
`;

type DispatchResult<T = unknown> = {
  error?: Error;
  data?: T;
};

type InsertDispatcher = (param: {
  email: string;
  name: string;
}) => Promise<DispatchResult<InsertStaffInvitationMutation>>;

type DeleteStaffDispatcher = (
  param: UserId
) => Promise<DispatchResult<DeleteStaffByIdMutation>>;

export type StaffsDispatcherResult = {
  insertDispatcher: InsertDispatcher;
  deleteStaff: DeleteStaffDispatcher;
};

export type StaffsDispatcherHook = () => StaffsDispatcherResult;

const useStaffsDispatcher: StaffsDispatcherHook = () => {
  const [, insertExecutor] = useInsertStaffInvitationMutation();
  const [, deleteStaffById] = useDeleteStaffByIdMutation();

  const insertDispatcher = useCallback<InsertDispatcher>(
    async (param) =>
      insertExecutor({
        object: {
          _staffInvitations: {
            data: [param],
          },
        },
      }),
    [insertExecutor]
  );

  const deleteStaff = useCallback<DeleteStaffDispatcher>(
    async (param) =>
      deleteStaffById({
        id: uuidString(param),
      }),
    [deleteStaffById]
  );

  return useMemo(
    () => ({
      insertDispatcher,
      deleteStaff,
    }),
    [deleteStaff, insertDispatcher]
  );
};

export default useStaffsDispatcher;
