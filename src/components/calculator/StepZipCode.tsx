"use client";

import { useCalculatorStore } from "@/stores/calculator-store";

export const StepZipCode = () => {
  const { inputs, setZipCode, setOwnsHome } = useCalculatorStore();

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZipCode(value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Where is your home?
        </h2>
        <p className="text-white/60 text-sm">
          We use your zip code to estimate local energy rates and incentives.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Zip Code
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={inputs.zipCode}
          onChange={handleZipChange}
          placeholder="e.g. 75201"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-lg text-white placeholder:text-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">
          Do you own your home?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {([true, false] as const).map((value) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setOwnsHome(value)}
              className={`rounded-xl border px-4 py-3 text-lg font-medium transition-all ${
                inputs.ownsHome === value
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
              }`}
            >
              {value ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      {inputs.ownsHome === false && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-amber-400 text-sm">
            Our savings calculator is designed for homeowners. If you&apos;re
            renting, we&apos;d recommend speaking with your landlord about solar
            options for the property.
          </p>
        </div>
      )}
    </div>
  );
};
