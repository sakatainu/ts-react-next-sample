import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useAuth } from 'reactfire';

const useLogout = () => {
  const router = useRouter();
  const auth = useAuth();

  return useCallback(async () => {
    await auth.signOut();
    await router.replace('/');
  }, [auth, router]);
};

export default useLogout;
