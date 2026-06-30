"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ProductRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

export function ProductReveal({
  children,
  className = "",
  delay = 0,
  duration = 800,
  y = 24,
}: ProductRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`ps-reveal ${visible ? "ps-reveal-visible" : ""} ${className}`}
      style={
        {
          "--ps-reveal-delay": `${delay}ms`,
          "--ps-reveal-duration": `${duration}ms`,
          "--ps-reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
