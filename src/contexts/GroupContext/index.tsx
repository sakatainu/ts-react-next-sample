import dayjs from 'dayjs';
import NextError from 'next/error';
import { createContext, useContext } from 'react';
import Expired from '~/components/page/Expired';
import ProgressBox from '~/components/ui/ProgressBox';
import { useSignedInUserContext } from '~/contexts/SignedInUserContext';
import useGroup, { GroupRole } from '~/hooks/useGroup';
import useUrlQuery from '~/hooks/useUrlQuery';

export type GroupContextType = {
  group: Group;
  userGroupRole: GroupRole;
};

const Context = createContext<GroupContextType | null>(null);

export const useGroupContext = (): GroupContextType => {
  const context = useContext(Context);
  if (!context) throw new Error('context is empty');
  return context;
};

export type GroupContextProps = {
  children?: React.ReactNode;
};

const GroupContext = ({ children }: GroupContextProps) => {
  const {
    user: { role },
  } = useSignedInUserContext();
  const { groupId: groupIdParam = [] } = useUrlQuery();
  const groupId = groupIdParam.at(0);
  const { fetching, result } = useGroup(groupId);

  if (!groupId) throw new Error('groupId is Empty');
  if (fetching) return <ProgressBox />;

  const isExistGroup = groupId && result;
  if (!isExistGroup) return <NextError statusCode={404} />;

  if (role !== 'staff') {
    const isExpired = dayjs().isAfter(result.group.contract.expireAt);
    if (isExpired) return <Expired />;
  }

  return <Context.Provider value={result}>{children} </Context.Provider>;
};

export default GroupContext;
