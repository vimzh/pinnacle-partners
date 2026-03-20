"use client";

import { useCalculatorStore } from "@/stores/calculator-store";
import { ROOF_SQFT_MIN, ROOF_SQFT_MAX } from "@/lib/constants";
import type { RoofAge, RoofType } from "@/lib/types";

const roofAgeOptions: { value: RoofAge; label: string }[] = [
  { value: "<5", label: "< 5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "10-20", label: "10–20 years" },
  { value: "20+", label: "20+ years" },
];

const roofTypeOptions: { value: RoofType; label: string }[] = [
  { value: "asphalt", label: "Asphalt Shingle" },
  { value: "metal", label: "Metal" },
  { value: "tile", label: "Tile" },
  { value: "flat", label: "Flat" },
];

export const StepRoofDetails = () => {
  const { inputs, setRoofSqft, setRoofAge, setRoofType } = useCalculatorStore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Tell us about your roof</h2>
        <p className="text-white/60 text-sm">Don&apos;t worry about exact numbers — estimates work great.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-white/80">Roof Size</label>
          <span className="text-lg font-semibold text-green-400">{inputs.roofSqft.toLocaleString()} sqft</span>
        </div>
        <input
          type="range"
          min={ROOF_SQFT_MIN}
          max={ROOF_SQFT_MAX}
          step={100}
          value={inputs.roofSqft}
          onChange={(e) => setRoofSqft(Number(e.target.value))}
          className="w-full accent-green-500"
        />
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>{ROOF_SQFT_MIN.toLocaleString()}</span>
          <span>{ROOF_SQFT_MAX.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">How old is your roof?</label>
        <div className="grid grid-cols-2 gap-2">
          {roofAgeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRoofAge(opt.value)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                inputs.roofAge === opt.value
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">Roof type</label>
        <div className="grid grid-cols-2 gap-2">
          {roofTypeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRoofType(opt.value)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                inputs.roofType === opt.value
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
