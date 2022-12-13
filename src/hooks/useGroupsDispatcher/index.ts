import {
  AcceptGroupInvitationMutation,
  Groups_Insert_Input,
  InsertGroupOneMutation,
  UpdateGroupByStaffMutationVariables,
  useAcceptGroupInvitationMutation,
  useInsertGroupOneMutation,
  useUpdateGroupByStaffMutation,
  useUpdateGroupMutation,
} from '@/generated/graphql';
import { useCallback, useMemo } from 'react';
import { gql } from 'urql';
import { useSignedInUserContext } from '~/contexts/SignedInUserContext';
import { uuidString } from '~/types/graphql';
import { DispatcherResult } from '~/types/hooks';

export const AcceptGroupInvitation = gql`
  mutation acceptGroupInvitation(
    $userId: uuid!
    $email: String!
    $groupId: uuid!
  ) {
    update_memberships(
      where: { groupInvitation: { email: { _eq: $email } } }
      _set: { userId: $userId }
    ) {
      affected_rows
    }
    delete_groupInvitations_by_pk(groupId: $groupId, email: $email) {
      groupId
      email
    }
  }
`;

export const InsertGroupOne = gql`
  mutation insertGroupOne($object: groups_insert_input!) {
    insert_groups_one(object: $object) {
      id
    }
  }
`;

export const UpdateGroupByStaff = gql`
  mutation updateGroupByStaff(
    $id: uuid!
    $groupStockIssueSet: groupStockIssues_set_input = {}
    $groupSet: groups_set_input = {}
    $groupTypeAssignmentSet: groupTypeAssignments_set_input = {}
    $groupSettlementDateSet: groupSettlementDates_set_input = {}
    $contractSet: contracts_set_input = {}
    $groupContentsSet: groupContents_set_input = {}
  ) {
    update_groups_by_pk(pk_columns: { id: $id }, _set: $groupSet) {
      id
    }

    update_groupStockIssues_by_pk(
      pk_columns: { groupId: $id }
      _set: $groupStockIssueSet
    ) {
      groupId
    }

    update_groupTypeAssignments(
      where: { groupId: { _eq: $id } }
      _set: $groupTypeAssignmentSet
    ) {
      affected_rows
    }

    update_groupSettlementDates_by_pk(
      pk_columns: { id: $id }
      _set: $groupSettlementDateSet
    ) {
      id
    }

    update_contracts_by_pk(pk_columns: { groupId: $id }, _set: $contractSet) {
      groupId
    }

    update_groupContents_by_pk(
      pk_columns: { id: $id }
      _set: $groupContentsSet
    ) {
      id
    }
  }
`;

export const UpdateGroup = gql`
  mutation updateGroup(
    $id: uuid!
    $groupStockIssueSet: groupStockIssues_set_input = {}
    $groupSet: groups_set_input = {}
  ) {
    update_groups_by_pk(pk_columns: { id: $id }, _set: $groupSet) {
      id
    }

    update_groupStockIssues_by_pk(
      pk_columns: { groupId: $id }
      _set: $groupStockIssueSet
    ) {
      groupId
    }
  }
`;

export type AcceptGroupInvitationFn = (
  user: User,
  groupId: GroupId
) => DispatcherResult<AcceptGroupInvitationMutation>;

export type CreateGroupFn = (
  param: Groups_Insert_Input
) => DispatcherResult<InsertGroupOneMutation>;

export type UpdateGroupFn = (
  param: UpdateGroupByStaffMutationVariables
) => DispatcherResult<unknown>;

export type GroupsDispatcherHookResult = {
  acceptGroupInvitation: AcceptGroupInvitationFn;
  createGroup: CreateGroupFn;
  updateGroup: UpdateGroupFn;
};

export type GroupsDispatcherHook = () => GroupsDispatcherHookResult;

const useGroupsDispatcher: GroupsDispatcherHook = () => {
  const {
    user: { role },
  } = useSignedInUserContext();
  const [, execAcceptGroupInvitation] = useAcceptGroupInvitationMutation();
  const [, execInsertGroup] = useInsertGroupOneMutation();
  const [, execUpdateGroupByStaff] = useUpdateGroupByStaffMutation();
  const [, execUpdateGroup] = useUpdateGroupMutation();

  const acceptGroupInvitation = useCallback<AcceptGroupInvitationFn>(
    async (user, groupId) =>
      execAcceptGroupInvitation({
        email: user.email,
        userId: uuidString(user.id),
        groupId: uuidString(groupId),
      }),
    [execAcceptGroupInvitation]
  );

  const createGroup = useCallback<CreateGroupFn>(
    (param) => {
      if (role !== 'staff') throw Error('permission denied');
      return execInsertGroup({ object: param });
    },
    [execInsertGroup, role]
  );

  const updateGroup = useCallback<UpdateGroupFn>(
    async (param) => {
      if (role === 'staff') {
        return execUpdateGroupByStaff(param);
      }
      return execUpdateGroup(param);
    },
    [execUpdateGroup, execUpdateGroupByStaff, role]
  );

  return useMemo(
    () => ({
      acceptGroupInvitation,
      createGroup,
      updateGroup,
    }),
    [acceptGroupInvitation, createGroup, updateGroup]
  );
};

export default useGroupsDispatcher;
