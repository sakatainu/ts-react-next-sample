import { useSelectGroupByIdQuery } from '@/generated/graphql';
import { useMemo } from 'react';
import { gql } from 'urql';
import { useSignedInUserContext } from '~/contexts/SignedInUserContext';
import { uuidString } from '~/types/graphql';

export const SelectGroupById = gql`
  query selectGroupById($id: uuid!, $userId: uuid!) {
    group: groups_by_pk(id: $id) {
      id
      name
      groupStockIssue {
        stockIssue {
          code
          name
        }
      }
      contract {
        planCode
        expireAt
        maxUsers
        startAt
      }
    }
    ownerships: ownerships_by_pk(groupId: $id, userId: $userId) {
      userId
    }
  }
`;

export type GroupRole = 'outGroup' | 'staff' | 'owner' | 'member';

export type GroupHookResult = {
  fetching: boolean;
  error?: Error;
  result:
    | {
        group: Group;
        userGroupRole: GroupRole;
      }
    | undefined;
};

export type GroupHook = (id: GroupId | undefined) => GroupHookResult;

const useGroup: GroupHook = (id) => {
  const { user } = useSignedInUserContext();
  const [{ data, fetching, error }] = useSelectGroupByIdQuery({
    pause: !id,
    ...(id && {
      variables: {
        id: uuidString(id),
        userId: uuidString(user.id),
      },
    }),
  });

  const result = useMemo<
    | {
        group: Group;
        userGroupRole: GroupRole;
      }
    | undefined
  >(() => {
    const dataGroup = data?.group;
    if (!dataGroup) return undefined;
    if (!dataGroup.contract)
      throw new Error(`Group "${dataGroup.id}" has not contract`);

    let groupRole: GroupRole = 'member';
    if (data?.ownerships) groupRole = 'owner';
    if (user.role === 'staff') groupRole = 'staff';

    const { planCode, maxUsers, startAt, expireAt } = dataGroup.contract;

    return {
      group: {
        ...dataGroup,
        stockIssue: dataGroup.groupStockIssue?.stockIssue || null,
        contract: {
          planCode,
          maxUsers,
          startAt: new Date(startAt),
          expireAt: new Date(expireAt),
        },
      },
      userGroupRole: groupRole,
    };
  }, [data?.group, data?.ownerships, user.role]);

  return useMemo(
    () => ({
      fetching,
      error,
      result,
    }),
    [error, fetching, result]
  );
};

export default useGroup;
