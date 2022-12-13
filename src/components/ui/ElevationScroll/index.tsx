import { useScrollTrigger } from '@mui/material';
import React from 'react';

export type ElevationScrollProps = {
  window?: () => Window;
  children: React.ReactElement;
};

const ElevationScroll = ({ children, window }: ElevationScrollProps) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
};

export default ElevationScroll;
