import { useRef, useEffect } from 'react';

const useIsMount = () => {

  const isMountRef = useRef(true);

  useEffect(() => {
    if (isMountRef.current) {
      isMountRef.current = false;
    }
  }, [isMountRef]);

  return isMountRef.current;
};

export default useIsMount;