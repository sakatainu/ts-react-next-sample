import { SelectMasterTypesQuery } from '@/generated/graphql';
import { createContext, useContext, useMemo } from 'react';
import ProgressBox from '~/components/ui/ProgressBox';
import { useGraphqlAuth } from '~/contexts/client/firebase/auth';
import useMasterTypes from '~/hooks/useMasterTypes';

export type MasterTypesContextType = {
  planTypes: SelectMasterTypesQuery['planTypes'];
  groupTypes: SelectMasterTypesQuery['groupTypes'];
};

const Context = createContext<MasterTypesContextType | null>(null);

export const useMasterTypesContext = (): MasterTypesContextType => {
  const context = useContext(Context);
  if (!context) throw new Error('context is empty');
  return context;
};

export type MasterTypesContextProps = {
  children?: React.ReactNode;
};

const Container = ({ children }: MasterTypesContextProps) => {
  const { fetching, data } = useMasterTypes();

  const contextValue = useMemo<MasterTypesContextType>(
    () => ({
      planTypes: data?.planTypes || [],
      groupTypes: data?.groupTypes || [],
    }),
    [data?.groupTypes, data?.planTypes]
  );

  if (fetching) return <ProgressBox />;
  return <Context.Provider value={contextValue}>{children} </Context.Provider>;
};

const MasterTypesContext = ({ children }: MasterTypesContextProps) => {
  const { userId } = useGraphqlAuth();

  if (!userId) return <>{children}</>;
  return <Container>{children}</Container>;
};

export default MasterTypesContext;
