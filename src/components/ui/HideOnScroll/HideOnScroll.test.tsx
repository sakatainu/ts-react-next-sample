import { Box, useScrollTrigger } from '@mui/material';
import { render, screen } from '~/__test__/utils';
import HideOnScroll from '.';

jest.mock('@mui/material/useScrollTrigger');

describe('HideOnScroll', () => {
  it('要素が表示される', () => {
    (useScrollTrigger as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    render(
      <HideOnScroll>
        <Box data-testid="hideTarget" />
      </HideOnScroll>
    );

    const target = screen.getByTestId('hideTarget');
    expect(target).toBeVisible();
  });

  it('下方向にスクロールしたときに要素を隠す', () => {
    (useScrollTrigger as jest.Mock)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    render(
      <HideOnScroll>
        <Box data-testid="hideTarget" />
      </HideOnScroll>
    );

    const target = screen.getByTestId('hideTarget');
    expect(target).not.toBeVisible();
  });
});
