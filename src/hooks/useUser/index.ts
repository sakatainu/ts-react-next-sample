import { useSelectUserByIdQuery } from '@/generated/graphql';
import { useMemo } from 'react';
import { gql } from 'urql';
import { UserId } from '~/contexts/client/firebase/auth';

export const SelectUserById = gql`
  query selectUserById($id: uuid!) {
    user: users_by_pk(id: $id) {
      id
      email
      name
    }
  }
`;

export type UserHookResult = {
  fetching: boolean;
  error?: Error;
  result: User | undefined;
};

export type UserHook = (id: UserId) => UserHookResult;

const useUser: UserHook = (id) => {
  const [{ fetching, error, data }] = useSelectUserByIdQuery({
    pause: !id,
    ...(!!id && {
      variables: {
        id,
      },
    }),
  });

  const result = useMemo(() => {
    if (!data?.user) return undefined;
    return data.user;
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

export default useUser;
