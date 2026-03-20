"use client";

import { motion, AnimatePresence } from "motion/react";
import { useCalculatorStore } from "@/stores/calculator-store";
import { StepZipCode } from "./StepZipCode";
import { StepRoofDetails } from "./StepRoofDetails";
import { StepEnergyInfo } from "./StepEnergyInfo";
import { StepLoading } from "./StepLoading";
import { StepResults } from "./StepResults";

const TOTAL_STEPS = 5;

const stepTitles = [
  "Location",
  "Roof Details",
  "Energy Usage",
  "Calculating",
  "Your Estimate",
];

export const CalculatorShell = () => {
  const { currentStep, nextStep, prevStep, inputs } = useCalculatorStore();

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return inputs.zipCode.length === 5 && inputs.ownsHome === true;
      case 2:
        return inputs.roofSqft > 0;
      case 3:
        return inputs.monthlyBill > 0;
      default:
        return false;
    }
  };

  const showNavigation = currentStep <= 3;
  const showBack = currentStep > 1 && currentStep <= 3;

  const steps = [
    <StepZipCode key="zip" />,
    <StepRoofDetails key="roof" />,
    <StepEnergyInfo key="energy" />,
    <StepLoading key="loading" />,
    <StepResults key="results" />,
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <div className="w-full max-w-lg mx-auto px-6 pt-8">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div
                className={`h-1 w-full rounded-full transition-colors duration-300 ${
                  i < currentStep ? "bg-green-500" : "bg-white/10"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-white/40 mb-8">
          <span>Step {Math.min(currentStep, TOTAL_STEPS)} of {TOTAL_STEPS}</span>
          <span>{stepTitles[currentStep - 1]}</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-lg mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep - 1]}
          </motion.div>
        </AnimatePresence>
      </div>

      {showNavigation && (
        <div className="w-full max-w-lg mx-auto px-6 pb-8 pt-4">
          <div className={`flex ${showBack ? "justify-between" : "justify-end"}`}>
            {showBack && (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-xl px-6 py-3 text-sm font-medium text-white/50 transition-colors hover:text-white/80"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className="rounded-xl bg-green-500 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-green-600 active:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
