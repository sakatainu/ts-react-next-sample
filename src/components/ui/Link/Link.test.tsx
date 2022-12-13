import { faker } from '@faker-js/faker';
import { render } from '~/__test__/utils';
import { useRouter } from 'next/router';

import Link from '.';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

describe('Link', () => {
  beforeAll(() => {
    (useRouter as jest.Mock).mockReturnValue({
      asPath: '/home',
      pathname: '/home',
    });
  });

  it('外部URLを表示できる1', () => {
    const url = faker.internet.url();

    const { container } = render(<Link href={url} />);

    expect(container.firstElementChild).toHaveAttribute('href', url);
    expect(container.firstElementChild).toHaveClass('MuiLink-root');
  });

  it('外部URLを表示できる2', () => {
    const url = new URL(faker.internet.url());

    const { container } = render(<Link href={url} />);

    expect(container.firstElementChild).toHaveAttribute('href', url.toString());
    expect(container.firstElementChild).toHaveClass('MuiLink-root');
  });

  it('外部URLを表示できる3', () => {
    const url = faker.internet.url();

    const { container } = render(<Link href={url} noLinkStyle />);

    expect(container.firstElementChild).toHaveAttribute('href', url);
    expect(container.firstElementChild).not.toHaveClass('MuiLink-root');
  });

  it('内部URLを表示できる1', () => {
    const { container } = render(<Link href="/home" />);

    expect(container.firstElementChild).toHaveAttribute('href', '/home');
    expect(container.firstElementChild).toHaveClass('MuiLink-root');
  });

  it('内部URLを表示できる2', () => {
    const { container } = render(<Link href="/home" noLinkStyle />);

    expect(container.firstElementChild).toHaveAttribute('href', '/home');
    expect(container.firstElementChild).not.toHaveClass('MuiLink-root');
  });
});
