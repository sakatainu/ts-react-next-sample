import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth, useUser as useAuthUser } from 'reactfire';
import ProgressBox from '~/components/ui/ProgressBox';
import { useGraphqlAuth } from '~/contexts/client/firebase/auth';
import useUser from '~/hooks/useUser';

export type SignedInUserContextType = {
  user: SignedInUser;
};

const Context = createContext<SignedInUserContextType | null>(null);

export const useSignedInUserContext = (): SignedInUserContextType => {
  const context = useContext(Context);
  if (!context) throw new Error('context is empty');
  return context;
};

export type SignedInUserContextProps = {
  children?: React.ReactNode;
  redirect?: string;
};

const SignedInUserContext = ({
  redirect,
  children,
}: SignedInUserContextProps) => {
  const auth = useAuth();
  const router = useRouter();
  const redirectPath = redirect || router.asPath;

  const { status, data: authUser } = useAuthUser();
  const { role, userId } = useGraphqlAuth();
  const { fetching: fetchingGqlUser, result: gqlUser } = useUser(userId);

  const loading = useMemo(() => {
    if (status === 'loading') return true;
    if (fetchingGqlUser) return true;

    // wait save claims
    if (!userId) return true;

    return false;
  }, [fetchingGqlUser, status, userId]);

  const contextValue = useMemo<SignedInUserContextType | undefined>(() => {
    if (!authUser || !gqlUser) return undefined;

    return {
      user: {
        ...gqlUser,
        auth: authUser,
        role,
      },
    };
  }, [authUser, gqlUser, role]);

  useEffect(() => {
    if (loading || contextValue) return;

    if (authUser) {
      (async () => {
        await auth.signOut();
      })();
      throw new Error('Failed to get internal user data.');
    }

    (async () => {
      await router.push(`/?redirect=${redirectPath}`);
    })();
  }, [auth, authUser, contextValue, loading, redirectPath, router]);

  if (contextValue) {
    return (
      <Context.Provider value={contextValue}>{children} </Context.Provider>
    );
  }

  return <ProgressBox />;
};

export default SignedInUserContext;
