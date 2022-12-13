import React, { createElement, useCallback, useMemo } from 'react';
import { GroupRole } from '~/hooks/useGroup';

export type AllowGroupFn = (allows: GroupRole[]) => boolean;
export type GroupRolePermissionProps = {
  allows: GroupRole[];
  children: React.ReactNode;
};

export type GroupAuthUtilsHook = (role: GroupRole | undefined) => {
  allow: AllowGroupFn;
  GroupPermission: React.ElementType<GroupRolePermissionProps>;
};

const useGroupAuthUtils: GroupAuthUtilsHook = (role) => {
  const allow = useCallback<AllowGroupFn>(
    (allows) => !!role && allows.includes(role),
    [role]
  );

  const GroupPermission = useCallback(
    ({ allows, children }: GroupRolePermissionProps) =>
      allow(allows) ? createElement(React.Fragment, null, children) : null,
    [allow]
  );

  return useMemo(
    () => ({
      allow,
      GroupPermission,
    }),
    [GroupPermission, allow]
  );
};

export default useGroupAuthUtils;
