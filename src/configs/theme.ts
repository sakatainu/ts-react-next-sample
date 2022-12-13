import { createTheme, responsiveFontSizes } from '@mui/material';

const baseTheme = createTheme({
  palette: {
    primary: {
      light: '#49d5e2ff',
      main: '#0098a6',
      dark: '#005961ff',
      contrastText: '#fff',
    },
  },
});
const theme = responsiveFontSizes(baseTheme);

export default theme;
