import { render } from '~/__test__/utils';
import ProgressBox from '.';

describe('ProgressBox', () => {
  it('要素が表示される', () => {
    const { container } = render(<ProgressBox />);

    expect(container.firstElementChild).toBeInTheDocument();
  });
});
