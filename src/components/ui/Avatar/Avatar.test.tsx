import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
import Avatar from '.';

describe('Avatar', () => {
  it('srcで指定した画像を表示する', () => {
    const src = faker.image.avatar();
    render(<Avatar src={src} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', src);
  });

  it('srcが指定されていない場合にフォールバックアイコンを表示', () => {
    render(<Avatar />);

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByTestId('BusinessIcon')).toBeInTheDocument();
  });
});
