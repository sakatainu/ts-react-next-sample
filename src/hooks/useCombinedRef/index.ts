import { useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

const useCombinedRef = <T = unknown>(
  ...refs: (React.MutableRefObject<T> | React.LegacyRef<T>)[]
) => useRef(mergeRefs(refs));

export default useCombinedRef;
