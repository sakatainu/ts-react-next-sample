import { UpdateUserMutation, useUpdateUserMutation } from '@/generated/graphql';
import { updateEmail, updateProfile, User as AuthUser } from 'firebase/auth';
import { useCallback, useMemo } from 'react';
import { gql } from 'urql';

import { DispatcherResult } from '~/types/hooks';
import { uuidString } from '~/types/graphql';

export const UpdateUser = gql`
  mutation updateUser($id: uuid!, $set: users_set_input) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`;

type UpdateUserFn = (
  identifier: {
    authUser: AuthUser;
    userId: UserId;
  },
  param: {
    name: string; // 氏名のみ更新可能
  }
) => DispatcherResult<UpdateUserMutation>;

export type UserDispatcherHook = () => {
  updateUser: UpdateUserFn;
};

const useUserDispatcher: UserDispatcherHook = () => {
  const [, updateGqlUser] = useUpdateUserMutation();

  const updateUser = useCallback<UpdateUserFn>(
    async ({ authUser: auth, userId }, { name }) => {
      try {
        await updateProfile(auth, { displayName: name });
        const { error, data } = await updateGqlUser({
          id: uuidString(userId),
          set: { name },
        });
        if (error) throw error;
        return {
          data,
        };
      } catch (e) {
        return { error: e as Error };
      }
    },
    [updateGqlUser]
  );

  return useMemo(
    () => ({
      updateUser,
    }),
    [updateUser]
  );
};

export default useUserDispatcher;
