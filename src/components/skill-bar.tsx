"use client";

import { motion, useReducedMotion } from "framer-motion";
import { toFa } from "@/lib/format";

/** نوار پیشرفت انیمیشنی مهارت */
export function SkillBar({
  name,
  proficiency,
  index = 0,
}: {
  name: string;
  proficiency: number;
  index?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold">{name}</span>
        <span className="tabular-fa font-black text-accent">
          {toFa(proficiency)}٪
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={proficiency}
        aria-label={name}
        className="h-2.5 overflow-hidden rounded-full bg-ring"
      >
        <motion.div
          className="relative h-full rounded-full bg-gradient-to-l from-accent to-accent/60"
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: reduce ? 0 : 1.3,
            delay: reduce ? 0 : 0.15 + index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-l from-white/25 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}
