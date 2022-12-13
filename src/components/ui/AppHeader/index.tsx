import { AppBar, Toolbar } from '@mui/material';
import React from 'react';
import ElevationScroll from '~/components/ui/ElevationScroll';
import Logo from '~/components/ui/Logo';
import Row from '~/components/ui/Row';

export type AppFrameProps = {
  children?: React.ReactNode;
};

const AppFrame = ({ children }: AppFrameProps) => (
  <ElevationScroll>
    <AppBar
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: 'white',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Row alignItems="center">
          <Logo
            sx={{
              width: 112,
              height: 36,
            }}
          />
        </Row>
        {children}
      </Toolbar>
    </AppBar>
  </ElevationScroll>
);

export default AppFrame;
