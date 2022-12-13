import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import Container from 'components/ui/Container';
import Link from '~/components/ui/Link';
import Logo from '~/components/ui/Logo';
import SignupForm, { SignupFormProps } from '~/components/ui/SignupForm';

export type TemplateProps = {
  defaultValue?: {
    email?: string;
  };
  onSubmit?: SignupFormProps['onSubmit'];
};

const Template = ({ defaultValue, onSubmit }: TemplateProps) => (
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
          サインアップ
        </Typography>
        <SignupForm defaultValue={defaultValue} onSubmit={onSubmit} />
      </Paper>
      <Box mt={2} />
      <Button LinkComponent={Link} href="/">
        ログインはこちら
      </Button>
    </Stack>
  </Container>
);

export default Template;
