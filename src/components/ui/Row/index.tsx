import { Stack, StackProps } from '@mui/material';
import { forwardRef } from 'react';

export type RowProps = StackProps;

const Row = forwardRef<unknown, StackProps>(({ children, ...rest }, ref) => (
  <Stack ref={ref} direction="row" minWidth={0} {...rest}>
    {children}
  </Stack>
));
Row.displayName = 'Row';

export default Row;
