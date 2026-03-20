"use client";

import { useCalculatorStore } from "@/stores/calculator-store";
import { MONTHLY_BILL_MIN, MONTHLY_BILL_MAX } from "@/lib/constants";
import type { InterestType } from "@/lib/types";

const interestOptions: { value: InterestType; label: string }[] = [
  { value: "roof", label: "Roof Replacement" },
  { value: "solar", label: "Solar Installation" },
  { value: "both", label: "Both" },
];

export const StepEnergyInfo = () => {
  const { inputs, setMonthlyBill, setInterest } = useCalculatorStore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Your energy usage</h2>
        <p className="text-white/60 text-sm">This helps us estimate your potential savings.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-white/80">Monthly Electric Bill</label>
          <span className="text-lg font-semibold text-green-400">${inputs.monthlyBill}</span>
        </div>
        <input
          type="range"
          min={MONTHLY_BILL_MIN}
          max={MONTHLY_BILL_MAX}
          step={10}
          value={inputs.monthlyBill}
          onChange={(e) => setMonthlyBill(Number(e.target.value))}
          className="w-full accent-green-500"
        />
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>${MONTHLY_BILL_MIN}</span>
          <span>${MONTHLY_BILL_MAX}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">What are you interested in?</label>
        <div className="grid grid-cols-1 gap-2">
          {interestOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setInterest(opt.value)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all text-left ${
                inputs.interest === opt.value
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
