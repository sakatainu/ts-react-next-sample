import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { useToggle } from 'react-use';

export type PasswordProps = TextFieldProps;

const Password = (props: PasswordProps) => {
  const [showPassword, toggleShowPassword] = useToggle(false);

  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      required
      InputProps={{
        inputProps: {
          minLength: 6,
        },
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => toggleShowPassword()}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      margin="normal"
      fullWidth
      autoComplete="off"
      {...props}
    />
  );
};

export default Password;
