import {
  Groups_Bool_Exp,
  SelectGroupsQuery,
  useSelectGroupsQuery,
} from '@/generated/graphql';
import { useMemo } from 'react';
import { gql } from 'urql';
import { useSignedInUserContext } from '~/contexts/SignedInUserContext';
import { AsyncHookResult } from '~/types/hooks';

export const SelectGroups = gql`
  query selectGroups(
    $where: groups_bool_exp!
    $email: String = ""
    $isStaff: Boolean = false
  ) {
    invited: groupInvitations(where: { email: { _eq: $email } }) {
      group {
        id
        name
      }
    }
    groups(where: $where) {
      userNum: memberships_aggregate {
        aggregate {
          count
        }
      }
      id
      name
      contract {
        plan {
          code
        }
        startAt
        expireAt
        maxUsers
      }
      groupStockIssue {
        stockIssue {
          code
          name
        }
      }
      groupSettlementDate {
        month
        day
      }
      groupTypeAssignment {
        groupType {
          code
        }
      }
      groupInvitations {
        email
      }
      groupContent @include(if: $isStaff) {
        memo
      }
    }
  }
`;

export type InvitedGroup = {
  id: GroupId;
  name: string;
};

export type Group = SelectGroupsQuery['groups'][number];

export type GroupsHookResult = AsyncHookResult<{
  invited: InvitedGroup[];
  groups: Group[];
}>;

export type GroupsHook = (groupsCondition: Groups_Bool_Exp) => GroupsHookResult;

const useGroups: GroupsHook = (groupsCondition) => {
  const { user } = useSignedInUserContext();

  const [{ fetching, error, data }] = useSelectGroupsQuery({
    variables: {
      where: groupsCondition,
      email: user.email,
      isStaff: user.role === 'staff',
    },
  });

  const result = useMemo(() => {
    if (!data) return undefined;
    const { invited, groups } = data;

    return {
      invited: invited.flatMap(({ group }) => (group ? [group] : [])),
      groups,
    };
  }, [data]);

  return useMemo(
    () => ({
      fetching,
      error,
      result,
    }),
    [error, fetching, result]
  );
};

export default useGroups;
