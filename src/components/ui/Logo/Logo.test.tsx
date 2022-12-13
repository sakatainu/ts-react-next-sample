import { useRouter } from 'next/router';
import { render, screen } from '~/__test__/utils';
import Logo from '.';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

describe('Logo', () => {
  beforeAll(() => {
    (useRouter as jest.Mock).mockReturnValue({
      asPath: '/home',
      pathname: '/home',
    });
  });

  it('ロゴがリンクで表示される', () => {
    render(<Logo />);

    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('ロゴが非リンクで表示される', () => {
    render(<Logo unlink />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
