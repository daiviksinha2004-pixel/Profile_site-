"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function AnimatedCounter({
  to,
  delay = 0,
  duration = 1.4,
}: {
  to: number;
  delay?: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now() + delay * 1000;
    function step(now: number) {
      const elapsed = Math.max(0, now - start);
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, delay, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
    </span>
  );
}
