import { useEffect, useState } from 'react';

const EVENT = 'resize';

const useBoxWidth = (ref:any) => {
  const [width, setWidth] = useState<number>(ref.current?.offsetWidth);

  useEffect(() => {
    const handleWindowSizeChange = () => {
      if (!ref || !ref.current) {
          return;
      }
      setWidth(ref.current?.offsetWidth);
    }

    window.addEventListener(EVENT, handleWindowSizeChange);
    return () => {
      window.removeEventListener(EVENT, handleWindowSizeChange);
    }
  }, [window.innerWidth, ref]);

  if (!width && ref && ref.current)
    return ref.current?.offsetWidth;

  return width;
};

export default useBoxWidth;