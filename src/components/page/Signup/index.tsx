import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { createGlobalState } from 'react-use';
import { useAuth, useSigninCheck } from 'reactfire';
import ProgressBox from '~/components/ui/ProgressBox';
import { useGraphqlAuth } from '~/contexts/client/firebase/auth';
import useUserDispatcher from '~/hooks/useUserDispatcher';
import { getErrorMessage, isFirebaseError } from '~/types/firebase/auth';
import Template, { TemplateProps } from './Template';

export type SignupProps = {
  defaultValue?: {
    email?: string;
  };
};

// createUserWithEmailAndPassword により、コンポーネントが遡って unmount / mount される。
// それによってコンポーネント内部で状態を保持できないため外部に状態を保持する
const useSignupState = createGlobalState<{
  userName: string;
} | null>(null);

const Signup = ({ defaultValue }: SignupProps) => {
  const router = useRouter();
  const auth = useAuth();
  const { status, data: signinCheckResult } = useSigninCheck();
  const { user: authUser, signedIn } = signinCheckResult;

  const { userId } = useGraphqlAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { updateUser } = useUserDispatcher();
  const [signupState, setSignupState] = useSignupState();

  useEffect(() => {
    if (!authUser || !userId) return;
    if (!signupState) {
      (async () => router.replace('/home'))();
      return;
    }

    const identifier = {
      authUser,
      userId,
    };

    (async () => {
      await updateUser(identifier, { name: signupState.userName });
      setSignupState(null);
    })();
  }, [authUser, router, setSignupState, signupState, updateUser, userId]);

  const handleSubmit: TemplateProps['onSubmit'] = (e, formValue) => {
    e.preventDefault();

    const { email, password, userName } = formValue;

    (async () => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setSignupState({ userName });
      } catch (error) {
        let message =
          'エラーが発生しました。しばらく時間をおいてお試しください';
        if (isFirebaseError(error)) {
          message = getErrorMessage(error);
        }

        enqueueSnackbar(message, { variant: 'error' });
      }
    })();
  };

  if (status === 'loading') {
    return <ProgressBox />;
  }

  if (signedIn) {
    // wait redirect
    return <ProgressBox />;
  }

  return <Template defaultValue={defaultValue} onSubmit={handleSubmit} />;
};

export default Signup;
