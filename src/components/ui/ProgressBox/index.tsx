import React, { forwardRef } from 'react';
import { Box, BoxProps, CircularProgress } from '@mui/material';

export type ProgressBoxProps = BoxProps;

const ProgressBox = forwardRef<unknown, BoxProps>((props, ref) => (
  <Box
    ref={ref}
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 64,
      ...props.sx,
    }}
  >
    <CircularProgress />
  </Box>
));
ProgressBox.displayName = 'ProgressBox';

export default ProgressBox;
