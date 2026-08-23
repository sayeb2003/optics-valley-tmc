"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * SIGNATURE ELEMENT — not decorative.
 * Every Toastmasters meeting times speeches with Green (qualifying) →
 * Yellow (30s–1min left) → Red (time's up) cards. This ring dramatizes
 * that real system rather than using a generic hero graphic. See
 * src/config/club.ts `timerSystem` for the source facts.
 */

const STAGES = [
  { color: "var(--color-timer-green)", label: "Green Card", duration: 3000 },
  { color: "var(--color-timer-yellow)", label: "Yellow Card", duration: 1500 },
  { color: "var(--color-timer-red)", label: "Red Card", duration: 1500 },
] as const;

export function SpeechTimerRing({ size = 220 }: { size?: number }) {
  const prefersReducedMotion = useReducedMotion();
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return; // static on green, no cycling
    const timer = setTimeout(
      () => setStageIndex((i) => (i + 1) % STAGES.length),
      STAGES[stageIndex].duration
    );
    return () => clearTimeout(timer);
  }, [stageIndex, prefersReducedMotion]);

  const stage = STAGES[prefersReducedMotion ? 0 : stageIndex];
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Speech timer showing ${stage.label}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-cream)"
          strokeOpacity={0.15}
          strokeWidth={6}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stage.color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference * 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1 text-center">
        <span
          className="h-3 w-3 rounded-full transition-colors duration-500"
          style={{ backgroundColor: stage.color }}
        />
        <span className="font-mono text-xs tracking-wider text-cream/80 uppercase mt-2">
          {stage.label}
        </span>
      </div>
    </div>
  );
}
