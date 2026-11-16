"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** WhatsApp / in-app WebViews often break IntersectionObserver — never leave content at opacity 0. */
const VIEWPORT_FAILSAFE_MS = 700;

function useReveal(reduce: boolean | null) {
  const [visible, setVisible] = useState(!!reduce);

  useEffect(() => {
    if (reduce) {
      setVisible(true);
      return;
    }
    const id = window.setTimeout(() => setVisible(true), VIEWPORT_FAILSAFE_MS);
    return () => window.clearTimeout(id);
  }, [reduce]);

  return {
    visible,
    reveal: () => setVisible(true),
  };
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const { visible, reveal } = useReveal(reduce);

  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      whileInView={visible || reduce ? undefined : { opacity: 1, y: 0 }}
      onViewportEnter={reveal}
      viewport={{ once: true, amount: 0.05, margin: "80px 0px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { visible, reveal } = useReveal(reduce);

  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? false : "hidden"}
      animate={visible ? "show" : undefined}
      whileInView={visible || reduce ? undefined : "show"}
      onViewportEnter={reveal}
      viewport={{ once: true, amount: 0.05, margin: "80px 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduce ? 0 : 0.1 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0, y: 18 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}
