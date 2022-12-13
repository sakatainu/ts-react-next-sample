import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useAuth, useSigninCheck } from 'reactfire';
import ProgressBox from '~/components/ui/ProgressBox';
import useUrlQuery from '~/hooks/useUrlQuery';
import { getErrorMessage, isFirebaseError } from '~/types/firebase/auth';
import Template, { TemplateProps } from './Template';

const Login = () => {
  const router = useRouter();
  const { redirect = [] } = useUrlQuery();
  const auth = useAuth();
  const { status, data: signinCheckResult } = useSigninCheck();
  const signedIn = Boolean(signinCheckResult?.signedIn);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!signedIn) return;

    (async () => {
      const redirectPath = redirect.at(0) || '/home';
      await router.replace(redirectPath);
    })();
  }, [redirect, router, signedIn]);

  const handleSubmit: TemplateProps['onSubmit'] = (e, formValue) => {
    e.preventDefault();

    const { email, password } = formValue;

    (async () => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
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
    return <ProgressBox />;
  }

  return <Template onSubmit={handleSubmit} />;
};

export default Login;
