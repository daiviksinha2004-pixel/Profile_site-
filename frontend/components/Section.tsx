"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
  fullWidth = false,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <section id={id} className={`relative py-24 ${className}`}>
      <div className={fullWidth ? "w-full" : "mx-auto max-w-6xl px-6"}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-base text-slate-400">{subtitle}</p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
