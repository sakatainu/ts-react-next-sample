import React, { useMemo } from 'react';

export const Context = React.createContext<{
  id: string;
  stockIssueCode: string;
} | null>(null);

type UserGroupProviderProps = {
  groupId: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
};

// TODO: ユーザーグループ

const UserGroupProvider = ({
  groupId,
  fallback,
  children,
}: UserGroupProviderProps) => {
  const isValidGroup = groupId === 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const contextValue = useMemo(
    () => ({
      id: groupId,
      stockIssueCode: '8306',
    }),
    [groupId]
  );

  if (!isValidGroup) return <>{fallback || null}</>;

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default UserGroupProvider;
