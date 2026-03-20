"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { useCalculatorStore } from "@/stores/calculator-store";

const leadSchema = z.object({
  fullName: z.string().min(2, "Please enter your name"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s\-()]+$/, "Invalid phone number"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export const StepResults = () => {
  const { result, isSubmitted, setLeadInfo, submitLead } = useCalculatorStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { fullName: "", phone: "", email: "" },
  });

  const onSubmit = (data: LeadFormData) => {
    setLeadInfo(data);
    submitLead();
  };

  if (!result) return null;

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 space-y-4"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Your estimate is on the way!</h3>
        <p className="text-white/60 text-sm">
          A specialist will call you within 24 hours with your full personalized savings report.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-3"
      >
        <p className="text-sm text-white/60 uppercase tracking-wider">Estimated Savings</p>
        <p className="text-4xl font-bold text-green-400">{formatCurrency(result.twentyYearDisplay)}</p>
        <p className="text-sm text-white/60">over 20 years</p>

        <div className="flex justify-center gap-6 pt-2">
          <div className="text-center">
            <p className="text-xl font-semibold text-white">~{formatCurrency(result.monthlySavingsDisplay)}</p>
            <p className="text-xs text-white/40">per month</p>
          </div>
          {result.paybackDisplay > 0 && (
            <div className="text-center">
              <p className="text-xl font-semibold text-white">{result.paybackDisplay.toFixed(1)} yrs</p>
              <p className="text-xs text-white/40">payback period</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="relative rounded-xl border border-white/5 bg-white/[0.02] p-4 overflow-hidden">
        <div className="blur-sm select-none pointer-events-none space-y-2">
          <div className="h-3 w-3/4 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/10" />
          <div className="h-3 w-2/3 rounded bg-white/10" />
          <div className="h-3 w-1/3 rounded bg-white/10" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-white/40 bg-black/60 px-3 py-1 rounded-full">
            Full breakdown available after sign-up
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-white/60 mb-4 text-center">
          Enter your info to get your full personalized estimate.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input
              {...register("fullName")}
              placeholder="Full name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
          </div>

          <div>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Phone number"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email (optional)"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-green-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:opacity-50"
          >
            Get My Full Estimate
          </button>
        </form>
      </motion.div>
    </div>
  );
};
