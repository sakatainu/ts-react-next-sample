import { Button, Stack, TextField } from '@mui/material';
import { useRef } from 'react';
import { useToggle } from 'react-use';
import EmailField from '~/components/ui/FormFields/Email';
import PasswordField from '~/components/ui/FormFields/Password';

export type FormValue = {
  email: string;
  userName: string;
  password: string;
};

export type SignupFormProps = {
  defaultValue?: Partial<FormValue>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>, value: FormValue) => void;
};

const SignupForm = ({ defaultValue, onSubmit }: SignupFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [canSubmit, toggleCanSubmit] = useToggle(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);

  const handleChange: React.FormEventHandler<HTMLFormElement> = () => {
    const email = emailRef.current?.value;
    const userName = userNameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    confirmPasswordRef.current?.setCustomValidity('');

    toggleCanSubmit(Boolean(email && userName && password && confirmPassword));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const email = emailRef.current?.value || '';
    const userName = userNameRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    if (password !== confirmPassword) {
      confirmPasswordRef.current?.setCustomValidity(
        'パスワードが一致しません。'
      );
      confirmPasswordRef.current?.reportValidity();
      return;
    }

    confirmPasswordRef.current?.setCustomValidity('');

    onSubmit?.(e, {
      email,
      userName,
      password,
    });
  };

  return (
    <Stack
      component="form"
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={handleChange}
    >
      <EmailField
        inputRef={emailRef}
        name="email"
        label="メールアドレス"
        autoFocus
        defaultValue={defaultValue?.email}
      />
      <TextField
        inputRef={userNameRef}
        name="userName"
        label="氏名"
        required
        margin="normal"
        fullWidth
        autoComplete="off"
      />
      <PasswordField
        inputRef={passwordRef}
        name="password"
        label="パスワード"
      />
      <PasswordField
        inputRef={confirmPasswordRef}
        name="confirmPassword"
        label="パスワード確認"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ my: 2 }}
        disabled={!canSubmit}
      >
        登録
      </Button>
    </Stack>
  );
};

export default SignupForm;
