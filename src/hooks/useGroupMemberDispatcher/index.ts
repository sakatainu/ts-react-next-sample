import {
  DeleteMembershipMutation,
  InsertMembershipMutation,
  useDeleteMembershipMutation,
  useDeleteOwnershipMutation,
  useInsertMembershipMutation,
  useInsertOwnershipMutation,
} from '@/generated/graphql';
import { useCallback, useMemo } from 'react';
import { gql } from 'urql';
import { uuidString } from '~/types/graphql';
import { DispatcherResult } from '~/types/hooks';

export const InsertMembership = gql`
  mutation insertMembership($object: memberships_insert_input!) {
    insert_memberships_one(object: $object) {
      userId
    }
  }
`;

export const DeleteMembership = gql`
  mutation deleteMembership($groupId: uuid!, $userId: uuid!) {
    delete_memberships_by_pk(groupId: $groupId, userId: $userId) {
      groupId
    }
  }
`;

export const InsertOwnership = gql`
  mutation insertOwnership($groupId: uuid!, $userId: uuid!) {
    insert_ownerships_one(object: { groupId: $groupId, userId: $userId }) {
      userId
    }
  }
`;

export const DeleteOwnership = gql`
  mutation deleteOwnership($groupId: uuid!, $userId: uuid!) {
    delete_ownerships_by_pk(groupId: $groupId, userId: $userId) {
      userId
    }
  }
`;

export type InviteGroupMemberFn = (param: {
  groupId: GroupId;
  email: string;
  name: string;
  role: 'member' | 'owner';
}) => DispatcherResult<InsertMembershipMutation>;

export type DeleteGroupMemberFn = (param: {
  groupId: GroupId;
  userId: UserId;
}) => DispatcherResult<DeleteMembershipMutation>;

export type UpdateMemberRoleFn = (param: {
  groupId: GroupId;
  userId: UserId;
  newRole: 'member' | 'owner';
}) => DispatcherResult<{
  userId: UserId;
} | null>;

export type GroupsDispatcherHookResult = {
  inviteGroupMember: InviteGroupMemberFn;
  deleteGroupMember: DeleteGroupMemberFn;
  updateMemberRole: UpdateMemberRoleFn;
};

export type GroupMemberDispatcherHook = () => GroupsDispatcherHookResult;

const useGroupMemberDispatcher: GroupMemberDispatcherHook = () => {
  const [, insertMembership] = useInsertMembershipMutation();
  const [, deleteMembership] = useDeleteMembershipMutation();
  const [, insertOwnership] = useInsertOwnershipMutation();
  const [, deleteOwnership] = useDeleteOwnershipMutation();

  const inviteGroupMember = useCallback<InviteGroupMemberFn>(
    ({ groupId, email, name, role }) =>
      insertMembership({
        object: {
          groupId: uuidString(groupId),
          _groupInvitations: {
            data: [
              {
                email,
                name,
              },
            ],
          },
          ...(role === 'owner' && {
            _ownerships: {
              data: [{}],
            },
          }),
        },
      }),
    [insertMembership]
  );

  const deleteGroupMember = useCallback<DeleteGroupMemberFn>(
    ({ groupId, userId }) =>
      deleteMembership({
        groupId: uuidString(groupId),
        userId: uuidString(userId),
      }),
    [deleteMembership]
  );

  const updateMemberRole = useCallback<UpdateMemberRoleFn>(
    async ({ groupId, userId, newRole }) => {
      const param = {
        groupId: uuidString(groupId),
        userId: uuidString(userId),
      };

      if (newRole === 'member') {
        const { error, data } = await deleteOwnership(param);
        return {
          error,
          data: data?.delete_ownerships_by_pk,
        };
      }
      const { error, data } = await insertOwnership(param);

      return {
        error,
        data: data?.insert_ownerships_one,
      };
    },
    [deleteOwnership, insertOwnership]
  );

  return useMemo(
    () => ({
      inviteGroupMember,
      updateMemberRole,
      deleteGroupMember,
    }),
    [deleteGroupMember, inviteGroupMember, updateMemberRole]
  );
};

export default useGroupMemberDispatcher;
