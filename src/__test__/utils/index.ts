import { render, RenderOptions, screen } from '@testing-library/react';
import { ReactElement } from 'react';
import '~/configs';

const customRender = (ui: ReactElement, options?: RenderOptions) => {
  const result = render(ui, options);

  screen.debug();

  return result;
};

const fireResize = (width: number, height?: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  if (height !== undefined) {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
  }
  window.dispatchEvent(new Event('resize'));
};

export * from '@testing-library/react';
export { customRender as render, fireResize };
