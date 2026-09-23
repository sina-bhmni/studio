"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { toFa } from "@/lib/format";

/** شمارنده‌ی متحرک آمار */
export function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  // وقتی reduced-motion فعال است، عدد را بدون انیمیشن و مستقیم از inView مشتق می‌کنیم
  const shownValue = reduce ? (inView ? value : 0) : display;

  return (
    <div ref={ref} className="flex flex-col items-start gap-1">
      <span className="tabular-fa text-5xl font-black tracking-tight text-foreground sm:text-6xl">
        {toFa(shownValue)}
        <span className="text-accent">{suffix}</span>
      </span>
      <span className="text-sm font-medium text-muted">{label}</span>
    </div>
  );
}
