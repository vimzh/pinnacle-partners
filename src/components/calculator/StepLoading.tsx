"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCalculatorStore } from "@/stores/calculator-store";

const loadingPhases = [
  { label: "Analyzing your roof...", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Checking local energy rates...", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { label: "Finding available incentives...", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export const StepLoading = () => {
  const [phase, setPhase] = useState(0);
  const { runCalculation, nextStep } = useCalculatorStore();

  useEffect(() => {
    runCalculation();
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => nextStep(), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <div className="relative h-16 w-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/10"
          style={{ borderTopColor: "#22c55e" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="h-12 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={loadingPhases[phase].icon} />
            </svg>
            <span className="text-white/80 text-sm">{loadingPhases[phase].label}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        {loadingPhases.map((_, i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full"
            animate={{
              backgroundColor: i <= phase ? "#22c55e" : "rgba(255,255,255,0.1)",
              scale: i === phase ? 1.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};
