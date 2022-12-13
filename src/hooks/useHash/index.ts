import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

const extractHash = (url: string): string | undefined => url.split('#')[1];

const useHash = (): [
  string | undefined,
  (newHash: string, options?: { replace?: boolean }) => void
] => {
  const router = useRouter();
  const hash = extractHash(router.asPath);

  const setHash = useCallback(
    (newHash: string, options?: { replace?: boolean }): void => {
      (async () => {
        if (options?.replace) {
          await router.replace({ hash: newHash }, undefined, { shallow: true });
        } else {
          await router.push({ hash: newHash }, undefined, { shallow: true });
        }
      })();
    },
    [router]
  );

  return useMemo(() => [hash, setHash], [hash, setHash]);
};

export default useHash;
