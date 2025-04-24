"use client"

import { useInView } from "framer-motion";
import { useRef } from "react";

export default function LayoutEffect({
  children,
  className,
  isInviewState: { trueState = "", falseState = "" },
}: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className={`${className || ""} ${isInView ? trueState : falseState}`}
    >
      {children}
    </div>
  );
}
