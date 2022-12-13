import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SignedInUserContext, {
  useSignedInUserContext,
} from '~/contexts/SignedInUserContext';

const Container = () => {
  const router = useRouter();
  const {
    user: { role },
  } = useSignedInUserContext();

  useEffect(() => {
    (async () => {
      if (role === 'staff') {
        await router.push('/home/groups');
        return;
      }

      await router.push('/home/select_group');
    })();
  }, [role, router]);

  return null;
};

const Home = () => (
  <SignedInUserContext>
    <Container />
  </SignedInUserContext>
);

export default Home;
