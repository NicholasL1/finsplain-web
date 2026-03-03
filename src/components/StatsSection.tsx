"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

interface Stat {
  label: string;
  borderTop: string;
  valueColor: string;
  format: (progress: number) => string;
}

const stats: Stat[] = [
  {
    label: "Documents analyzed",
    borderTop: "border-t-emerald-500/50",
    valueColor: "text-emerald-600 dark:text-emerald-400",
    format: (p) => `${Math.round(p * 10000).toLocaleString()}+`,
  },
  {
    label: "Hidden fees found",
    borderTop: "border-t-amber-500/50",
    valueColor: "text-amber-600 dark:text-amber-400",
    format: (p) => `$${(p * 2.4).toFixed(1)}M`,
  },
  {
    label: "Average analysis time",
    borderTop: "border-t-indigo-500/50",
    valueColor: "text-indigo-600 dark:text-indigo-400",
    format: (p) => `< ${Math.round(60 - p * 30)}s`,
  },
  {
    label: "User rating",
    borderTop: "border-t-emerald-500/50",
    valueColor: "text-emerald-600 dark:text-emerald-400",
    format: (p) => `${(p * 4.9).toFixed(1)}/5`,
  },
];

function useCountUp(active: boolean, duration = 1500) {
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, duration]);

  return progress;
}

function StatCard({
  stat,
  active,
  index,
}: {
  stat: Stat;
  active: boolean;
  index: number;
}) {
  const progress = useCountUp(active);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`flex flex-col items-center text-center p-6 rounded-2xl border border-border border-t-2 ${stat.borderTop} bg-card`}
    >
      <div
        className={`font-heading text-4xl sm:text-5xl font-bold tabular-nums leading-none mb-2 ${stat.valueColor}`}
      >
        {stat.format(progress)}
      </div>
      <div className="text-sm text-muted-foreground">{stat.label}</div>
    </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-12 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              active={isInView}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
