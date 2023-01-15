import { useEffect, useState } from 'react';

export function useOnScreen(
  ref: React.MutableRefObject<Element>,
  rootMargin = '0px',
) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const refCopy = ref;
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.unobserve(refCopy.current);
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}
