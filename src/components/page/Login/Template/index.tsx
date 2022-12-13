import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import Container from 'components/ui/Container';
import Link from '~/components/ui/Link';
import LoginForm, { LoginFormProps } from '~/components/ui/LoginForm';
import Logo from '~/components/ui/Logo';

export type TemplateProps = {
  onSubmit?: LoginFormProps['onSubmit'];
};

const Template = ({ onSubmit }: TemplateProps) => (
  <Container sx={{ pt: 4 }}>
    <Stack
      sx={{
        alignItems: 'center',
      }}
    >
      <Box p={2}>
        <Logo unlink />
      </Box>
      <Paper
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 4,
        }}
      >
        <Typography variant="h5" component="h1" align="center">
          ログイン
        </Typography>
        <LoginForm onSubmit={onSubmit} />
      </Paper>
      <Box mt={2} />
      <Button LinkComponent={Link} href="/signup">
        新規登録はこちら
      </Button>
    </Stack>
  </Container>
);

export default Template;
