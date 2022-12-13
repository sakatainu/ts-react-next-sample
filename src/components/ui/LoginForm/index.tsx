import { Box, Button, Stack } from '@mui/material';
import { useRef } from 'react';
import EmailField from '~/components/ui/FormFields/Email';
import PasswordField from '~/components/ui/FormFields/Password';
import Link from '~/components/ui/Link';

export type FormValue = {
  email: string;
  password: string;
};

export type LoginFormProps = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>, value: FormValue) => void;
};

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    onSubmit?.(e, {
      email,
      password,
    });
  };

  return (
    <Stack component="form" onSubmit={handleSubmit}>
      <EmailField
        inputRef={emailRef}
        name="email"
        label="メールアドレス"
        autoFocus
      />
      <PasswordField
        inputRef={passwordRef}
        name="password"
        label="パスワード"
      />
      <Box
        sx={{
          alignSelf: 'end',
        }}
      >
        <Link href="/reset-password" variant="body2">
          パスワードをお忘れですか？
        </Link>
      </Box>

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        ログイン
      </Button>
    </Stack>
  );
};

export default LoginForm;
