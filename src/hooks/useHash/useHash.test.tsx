import { useRouter } from 'next/router';
import { act, renderHook } from '~/__test__/utils';
import useHash from '.';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
const mockPush = jest.fn();
const mockReplace = jest.fn();

describe('useHash', () => {
  beforeEach(() => {
    const returnValue = {
      asPath: '/home',
      push: mockPush,
      replace: mockReplace,
    };
    (useRouter as jest.Mock).mockReturnValue(returnValue);
    jest.spyOn(returnValue, 'push');
    mockPush.mockClear();
  });

  it('URLハッシュが取得できる', () => {
    (useRouter as jest.Mock).mockReturnValue({
      asPath: '/home#abc',
    });

    const { result } = renderHook(() => useHash());

    const hash = result.current[0];
    expect(hash).toBe('abc');
  });

  test('setHash を実行すると useRouter の push が呼び出される', () => {
    const { result } = renderHook(() => useHash());
    const hash = result.current[0];
    const setHash = result.current[1];

    expect(hash).toBe(undefined);
    act(() => {
      setHash('#abc');
    });
    expect(mockPush.mock.calls[0]).toEqual([
      { hash: '#abc' },
      undefined,
      { shallow: true },
    ]);
  });

  test('replace で setHash を実行すると useRouter の replace が呼び出される', () => {
    const { result } = renderHook(() => useHash());
    const hash = result.current[0];
    const setHash = result.current[1];

    expect(hash).toBe(undefined);
    act(() => {
      setHash('#abc', { replace: true });
    });
    expect(mockReplace.mock.calls[0]).toEqual([
      { hash: '#abc' },
      undefined,
      { shallow: true },
    ]);
  });
});
