import { useSelectStaffsQuery } from '@/generated/graphql';
import { useMemo } from 'react';
import { gql } from 'urql';

export const SelectStaffs = gql`
  query selectStaffs {
    staffs(order_by: { user: { name: asc } }) {
      user {
        id
        email
        name
      }
    }
    staffInvitations(order_by: { staff: { user: { name: asc } } }) {
      email
      name
      staff {
        user {
          id
          email
          name
        }
      }
    }
  }
`;

export type StaffsHookResult = {
  fetching: boolean;
  error?: Error;
  result:
    | {
        invited: Omit<User, 'id'>[];
        staff: User[];
      }
    | undefined;
};

export type StaffsHook = () => StaffsHookResult;

const useStaffs: StaffsHook = () => {
  const [{ fetching, error, data }] = useSelectStaffsQuery();

  const result = useMemo(() => {
    if (!data) return undefined;

    const { staffInvitations = [], staffs = [] } = data;

    return {
      invited: staffInvitations,
      staff: staffs.flatMap(({ user }) => (user ? [user] : [])),
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

export default useStaffs;
