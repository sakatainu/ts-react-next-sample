import { render } from '~/__test__/utils';
import AsyncPresenter from '~/components/ui/AsyncPresenter';

describe('AsyncPresenter', () => {
  it('loading が true の場合は CircularProgress を中心に表示する', () => {
    const content = 'ローディング完了';
    const { container } = render(
      <AsyncPresenter loading>{content}</AsyncPresenter>
    );

    const progress = container.firstElementChild;

    expect(progress?.firstElementChild).toHaveAttribute('role', 'progressbar');
    expect(container).not.toHaveTextContent(content);
  });

  it('loading が false の場合は children を表示する', () => {
    const content = 'ローディング完了';
    const { container } = render(
      <AsyncPresenter loading={false}>ローディング完了</AsyncPresenter>
    );

    const progress = container.firstElementChild;

    expect(progress).toBeNull();
    expect(container).toHaveTextContent(content);
  });
});
