import React, { createElement, useCallback, useMemo } from 'react';
import { Role } from '~/contexts/client/firebase/auth';

export type AllowFn = (allows: Role[]) => boolean;
export type RolePermissionProps = { allows: Role[]; children: React.ReactNode };

export type AuthUtilsHook = (role: Role) => {
  allow: AllowFn;
  UserPermission: React.ElementType<RolePermissionProps>;
};

const useAuthUtils: AuthUtilsHook = (role) => {
  const allow = useCallback<AllowFn>((allows) => allows.includes(role), [role]);

  const UserPermission = useCallback(
    ({ allows, children }: RolePermissionProps) =>
      allow(allows) ? createElement(React.Fragment, null, children) : null,
    [allow]
  );

  return useMemo(
    () => ({
      allow,
      UserPermission,
    }),
    [UserPermission, allow]
  );
};

export default useAuthUtils;
