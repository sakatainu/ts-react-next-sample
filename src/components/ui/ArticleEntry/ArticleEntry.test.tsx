import { render } from '~/__test__/utils';
import ArticleEntry from '.';

describe('ArticleEntry', () => {
  it('要素が表示される', () => {
    const { container } = render(
      <ArticleEntry
        value={{
          id: '',
          about: {
            name: 'aaaa',
          },
          content: '',
          distributor: {
            name: '',
          },
          publishedAt: new Date(),
          sourceRef: '',
          title: '',
        }}
      />
    );

    const target = container.firstElementChild;
    expect(target).toBeInTheDocument();
  });
});
