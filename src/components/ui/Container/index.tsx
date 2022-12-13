import React from 'react';
import {
  Container as MuiContainer,
  ContainerProps as MuiContainerProps,
  styled,
} from '@mui/material';

const StyledContainer = styled(MuiContainer)<MuiContainerProps>(
  ({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  })
);

export type ContainerProps = MuiContainerProps;

const Container = React.forwardRef<HTMLDivElement, MuiContainerProps>(
  ({ children, maxWidth, ...rest }, ref) => (
    <StyledContainer {...rest} ref={ref} maxWidth={maxWidth || 'md'}>
      {children}
    </StyledContainer>
  )
);
Container.displayName = 'Container';

export default Container;
