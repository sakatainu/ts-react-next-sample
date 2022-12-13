import React, { cloneElement, ReactElement } from 'react';
import { Slide, useScrollTrigger } from '@mui/material';

export type HideOnScrollProps = {
  children: ReactElement;
};

const HideOnScroll = ({ children }: HideOnScrollProps) => {
  // 下方向 true, 上方向 false
  const isTrapOnBottom = useScrollTrigger({
    target: window,
  });

  // 最上端 true
  const isTrapOnTop = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window,
  });

  return (
    <Slide appear={false} direction="down" in={!isTrapOnBottom}>
      {cloneElement(children, {
        elevation: isTrapOnTop ? 4 : 0,
      })}
    </Slide>
  );
};

export default HideOnScroll;
