import { useCallback } from 'react';
import * as wanakana from 'wanakana';

// TODO: gql対応

// const normalize = (str: string) => wanakana.toKatakana(wanakana.toKana(str));

export type SearchHooks = <T extends object>(
  data: T[],
  indexKeys: (keyof T)[],
  options?: object
) => (query: string) => Promise<T[]>;

export const useSearch: SearchHooks = <T extends object>(
  data: T[],
  indexKeys: (keyof T)[]
) =>
  useCallback(
    (query = '') => {
      if (!data.length || !indexKeys.length) return Promise.resolve([]);
      if (!query) return Promise.resolve([]);

      const kanaQuery = wanakana.toKana(query);
      const hiraQuery = wanakana.toHiragana(query);
      const kataQuery = wanakana.toKatakana(query);
      const romajiQuery = wanakana.toRomaji(query);
      const q = Array.from(
        new Set([
          query.toLowerCase(),
          kanaQuery,
          hiraQuery,
          kataQuery,
          romajiQuery,
        ])
      );

      // const queryValue = normalize(query.trim());

      const result = data.filter((v) =>
        // const normalizedIndex = indexKeys.flatMap((key) => {
        //   const param = v[key];
        //   if (typeof param === 'string') {
        //     return [normalize(param)];
        //   }
        //   return [];
        // });

        // return normalizedIndex.includes(queryValue);

        indexKeys.some((key) => {
          const param = v[key];
          if (typeof param === 'string') {
            // console.log(param);

            return q.some((queryValue) =>
              param.toLowerCase().includes(queryValue)
            );
          }
          return false;
        })
      );

      return Promise.resolve(result);
    },
    [data, indexKeys]
  );
