import { render } from '~/__test__/utils';
import Container from '.';

describe('Container', () => {
  it('要素が表示される', () => {
    const { container } = render(<Container />);

    const innerContainer = container.firstElementChild;
    expect(innerContainer).toBeInTheDocument();
  });
});
