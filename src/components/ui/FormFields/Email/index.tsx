import { TextField, TextFieldProps } from '@mui/material';

export type EmailProps = TextFieldProps;

const Email = (props: EmailProps) => (
  <TextField
    type="email"
    required
    margin="normal"
    fullWidth
    autoComplete="email"
    autoFocus
    {...props}
  />
);

export default Email;
