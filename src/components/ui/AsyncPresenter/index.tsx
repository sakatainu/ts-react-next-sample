import { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';

export type AsyncPresenterProps = {
  loading: boolean;
  children?: ReactNode;
};

const AsyncPresenter = ({ loading, children = null }: AsyncPresenterProps) => {
  if (loading) {
    return (
      <Box
        sx={{
          width: 1,
          height: '64px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default AsyncPresenter;
