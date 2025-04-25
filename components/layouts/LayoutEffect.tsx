'use client';

import { useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface LayoutEffectProps {
  children: ReactNode;
  className?: string;
  isInviewState: {
    trueState?: string;
    falseState?: string;
  };
}

export default function LayoutEffect({
  children,
  className = '',
  isInviewState: { trueState = '', falseState = '' },
}: LayoutEffectProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className={`${className} ${isInView ? trueState : falseState}`}
    >
      {children}
    </div>
  );
}
