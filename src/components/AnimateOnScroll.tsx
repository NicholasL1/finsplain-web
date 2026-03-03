"use client";

import { motion } from "motion/react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  duration?: number;
  className?: string;
}

const directionVariants = {
  up: { y: 24, opacity: 0 },
  left: { x: -20, opacity: 0 },
  right: { x: 20, opacity: 0 },
  none: { opacity: 0 },
};

export default function AnimateOnScroll({
  children,
  delay = 0,
  direction = "up",
  duration = 0.5,
  className,
}: AnimateOnScrollProps) {
  return (
    <motion.div
      initial={directionVariants[direction]}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
