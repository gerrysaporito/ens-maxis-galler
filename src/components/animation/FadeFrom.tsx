import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { useOnScreen } from '@app/hooks/useOnScreen';

interface IFadeFrom {
  direction: 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const FadeFrom: React.FC<IFadeFrom> = ({ children, direction }) => {
  const controls = useAnimation();
  const rootRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const onScreen = useOnScreen(rootRef);
  useEffect(() => {
    if (onScreen) {
      controls.start({
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      });
    }
  }, [onScreen, controls]);

  let initialX = 0;
  if (direction === 'right') {
    initialX = 30;
  } else if (direction === 'left') {
    initialX = -30;
  }

  return (
    <motion.div
      ref={rootRef}
      initial={{
        opacity: 0,
        x: initialX,
        y: direction === 'bottom' ? 30 : 0,
      }}
      animate={controls}
    >
      {children}
    </motion.div>
  );
};
