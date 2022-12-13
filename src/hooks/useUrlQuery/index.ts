import { useRouter } from 'next/router';
import { useMemo } from 'react';

const useUrlQuery = (): Record<string, string[] | undefined> => {
  const router = useRouter();

  return useMemo(() => {
    const flatList = Object.keys(router.query).map<[string, string[]]>(
      (key) => {
        const query = router.query[key] as string | string[];
        return [key, Array.isArray(query) ? query : [query]];
      }
    );

    return Object.fromEntries(flatList);
  }, [router.query]);
};

export default useUrlQuery;
