import { Box, BoxProps } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { useRef } from 'react';

export type AppSubMenuProps = BoxProps & {
  children?: React.ReactNode;
};

const AppSideSubMenu = ({ children, sx, ...boxProps }: AppSubMenuProps) => {
  const ref = useRef(null);
  if (!children) return null;

  return (
    <Box
      ref={ref}
      sx={deepmerge(
        {
          flex: '1 1 auto',
          minWidth: 0,
          borderLeft: '1px solid',
          borderLeftColor: ({ palette }) => palette.divider,
          position: 'relative',
        },
        sx
      )}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

export default AppSideSubMenu;
