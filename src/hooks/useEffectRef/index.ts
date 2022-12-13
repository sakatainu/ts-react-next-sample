import { useEffect, useRef } from 'react';

const useEffectRef = <T extends object>(deps: T) => {
  const ref = useRef(deps);

  useEffect(() => {
    ref.current = deps;
  }, [deps]);

  return ref;
};

export default useEffectRef;
