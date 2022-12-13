import { render } from '~/__test__/utils';
import Row from '.';

describe('Row', () => {
  it('要素が表示される', () => {
    const { container } = render(<Row />);

    expect(container.firstElementChild).toBeInTheDocument();
  });
});
