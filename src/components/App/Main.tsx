import { CacheProvider, EmotionCache } from '@emotion/react';
import '@fontsource/josefin-sans';
import '@fontsource/roboto';
import {
  Box,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  Toolbar,
} from '@mui/material';
import ModalProvider from 'mui-modal-provider';
import { SnackbarProvider } from 'notistack';
import { globalStyles, theme } from '~/configs';
import ClientProvider from '~/contexts/client';
import MasterTypesContext from '~/contexts/MasterTypesContext';
import Header from './AppHeader';

export type MainProps = {
  children: JSX.Element;
  emotionCache: EmotionCache;
};

const Main = ({ children, emotionCache }: MainProps) => (
  <>
    <CssBaseline />
    <GlobalStyles styles={globalStyles} />
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <ClientProvider>
          <MasterTypesContext>
            <ModalProvider>
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Header />
                <Toolbar />
                <Box component="main" sx={{ flex: '1 1 auto', minWidth: 0 }}>
                  {children}
                </Box>
              </SnackbarProvider>
            </ModalProvider>
          </MasterTypesContext>
        </ClientProvider>
      </ThemeProvider>
    </CacheProvider>
  </>
);

export default Main;
