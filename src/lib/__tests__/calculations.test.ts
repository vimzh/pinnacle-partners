import { describe, it, expect } from "vitest";
import {
  getStateFromZip,
  calculateSolarEstimate,
  calculateRoofingEstimate,
  calculateEstimate,
} from "@/lib/calculations";
import type { CalculatorInputs } from "@/lib/types";

const baseSolarInputs: CalculatorInputs = {
  zipCode: "75201",
  ownsHome: true,
  roofSqft: 1500,
  roofAge: "<5",
  roofType: "asphalt",
  monthlyBill: 150,
  interest: "solar",
};

const baseRoofInputs: CalculatorInputs = {
  ...baseSolarInputs,
  interest: "roof",
};

const baseBothInputs: CalculatorInputs = {
  ...baseSolarInputs,
  interest: "both",
};

describe("getStateFromZip", () => {
  it("returns TX for zip 75201", () => {
    expect(getStateFromZip("75201")).toBe("TX");
  });

  it("returns CA for zip 90001", () => {
    expect(getStateFromZip("90001")).toBe("CA");
  });

  it("returns AZ for zip 85001", () => {
    expect(getStateFromZip("85001")).toBe("AZ");
  });

  it("returns CO for zip 80203", () => {
    expect(getStateFromZip("80203")).toBe("CO");
  });

  it("returns NY for zip 10001", () => {
    expect(getStateFromZip("10001")).toBe("NY");
  });

  it("returns DEFAULT for unknown zip", () => {
    expect(getStateFromZip("00000")).toBe("DEFAULT");
  });

  it("returns DEFAULT for empty string", () => {
    expect(getStateFromZip("")).toBe("DEFAULT");
  });

  it("returns DEFAULT for short zip", () => {
    expect(getStateFromZip("7")).toBe("DEFAULT");
  });
});

describe("calculateSolarEstimate", () => {
  it("returns positive annual savings", () => {
    const result = calculateSolarEstimate(baseSolarInputs);
    expect(result.annualSavings).toBeGreaterThan(0);
  });

  it("calculates system cost correctly: (sqft / 17.5) * 400 * 3.0", () => {
    const result = calculateSolarEstimate(baseSolarInputs);
    const expected = (1500 / 17.5) * 400 * 3.0;
    expect(result.systemCost).toBeCloseTo(expected, 2);
  });

  it("calculates federal ITC at 30% of system cost", () => {
    const result = calculateSolarEstimate(baseSolarInputs);
    expect(result.federalItc).toBeCloseTo(result.systemCost * 0.3, 2);
  });

  it("calculates net cost as systemCost - federalItc - stateRebates", () => {
    const result = calculateSolarEstimate(baseSolarInputs);
    const expected = result.systemCost - result.federalItc - result.stateRebates;
    expect(result.netCost).toBeCloseTo(expected, 2);
  });

  it("calculates monthly savings as annualSavings / 12", () => {
    const result = calculateSolarEstimate(baseSolarInputs);
    expect(result.monthlySavings).toBeCloseTo(result.annualSavings / 12, 2);
  });

  it("calculates payback years as netCost / annualSavings", () => {
    const result = calculateSolarEstimate(baseSolarInputs);
    expect(result.paybackYears).toBeCloseTo(result.netCost / result.annualSavings, 2);
  });

  it("calculates twenty year savings as annualSavings * 20 - netCost", () => {
    const result = calculateSolarEstimate(baseSolarInputs);
    expect(result.twentyYearSavings).toBeCloseTo(result.annualSavings * 20 - result.netCost, 2);
  });

  it("includes state rebates for CA", () => {
    const caInputs: CalculatorInputs = { ...baseSolarInputs, zipCode: "90001" };
    const result = calculateSolarEstimate(caInputs);
    expect(result.stateRebates).toBe(1500);
  });

  it("includes state rebates for NY", () => {
    const nyInputs: CalculatorInputs = { ...baseSolarInputs, zipCode: "10001" };
    const result = calculateSolarEstimate(nyInputs);
    expect(result.stateRebates).toBe(2000);
  });

  it("has zero state rebates for TX", () => {
    const result = calculateSolarEstimate(baseSolarInputs);
    expect(result.stateRebates).toBe(0);
  });

  it("uses TX electricity rate of 0.13 for TX zip", () => {
    const result = calculateSolarEstimate(baseSolarInputs);
    expect(result.localRatePerKwh).toBe(0.13);
  });

  it("uses CA electricity rate of 0.23 for CA zip", () => {
    const caInputs: CalculatorInputs = { ...baseSolarInputs, zipCode: "90001" };
    const result = calculateSolarEstimate(caInputs);
    expect(result.localRatePerKwh).toBe(0.23);
  });

  it("uses DEFAULT rate for unknown zip", () => {
    const unknownInputs: CalculatorInputs = { ...baseSolarInputs, zipCode: "00000" };
    const result = calculateSolarEstimate(unknownInputs);
    expect(result.localRatePerKwh).toBe(0.14);
  });
});

describe("calculateRoofingEstimate", () => {
  it("calculates replacement cost as sqft * costPerSqft for asphalt", () => {
    const result = calculateRoofingEstimate(baseRoofInputs);
    expect(result.replacementCost).toBeCloseTo(1500 * 4.5, 2);
  });

  it("calculates replacement cost for metal roof", () => {
    const metalInputs: CalculatorInputs = { ...baseRoofInputs, roofType: "metal" };
    const result = calculateRoofingEstimate(metalInputs);
    expect(result.replacementCost).toBeCloseTo(1500 * 12.0, 2);
  });

  it("calculates emergency premium as replacementCost * 1.4", () => {
    const result = calculateRoofingEstimate(baseRoofInputs);
    expect(result.emergencyPremium).toBeCloseTo(result.replacementCost * 1.4, 2);
  });

  it("calculates remaining life for asphalt with age <5", () => {
    const result = calculateRoofingEstimate(baseRoofInputs);
    // asphalt max life = 25, age <5 = 3 years used => 22 remaining
    expect(result.remainingLife).toBe(22);
  });

  it("calculates remaining life for metal with age 5-10", () => {
    const metalInputs: CalculatorInputs = { ...baseRoofInputs, roofType: "metal", roofAge: "5-10" };
    const result = calculateRoofingEstimate(metalInputs);
    // metal max life = 50, age 5-10 = 7 years used => 43 remaining
    expect(result.remainingLife).toBe(43);
  });

  it("returns 0 remaining life when age exceeds max life", () => {
    const oldFlatInputs: CalculatorInputs = { ...baseRoofInputs, roofType: "flat", roofAge: "20+" };
    const result = calculateRoofingEstimate(oldFlatInputs);
    // flat max life = 20, age 20+ = 25 years used => 0 (clamped at 0)
    expect(result.remainingLife).toBe(0);
  });

  it("calculates insurance savings annual as avgInsurance * 0.15", () => {
    const result = calculateRoofingEstimate(baseRoofInputs);
    // TX avg insurance = 4200, * 0.15 = 630
    expect(result.insuranceSavingsAnnual).toBeCloseTo(4200 * 0.15, 2);
  });

  it("calculates total savings as (emergencyPremium - replacementCost) + (insuranceSavingsAnnual * remainingLife)", () => {
    const result = calculateRoofingEstimate(baseRoofInputs);
    const expected =
      (result.emergencyPremium - result.replacementCost) +
      (result.insuranceSavingsAnnual * result.remainingLife);
    expect(result.totalSavings).toBeCloseTo(expected, 2);
  });

  it("uses DEFAULT insurance for unknown zip", () => {
    const unknownInputs: CalculatorInputs = { ...baseRoofInputs, zipCode: "00000" };
    const result = calculateRoofingEstimate(unknownInputs);
    expect(result.insuranceSavingsAnnual).toBeCloseTo(2400 * 0.15, 2);
  });
});

describe("calculateEstimate", () => {
  it("returns solar estimate when interest is solar", () => {
    const result = calculateEstimate({ ...baseSolarInputs, interest: "solar" });
    expect(result.solar).not.toBeNull();
    expect(result.roofing).toBeNull();
  });

  it("returns roofing estimate when interest is roof", () => {
    const result = calculateEstimate({ ...baseSolarInputs, interest: "roof" });
    expect(result.solar).toBeNull();
    expect(result.roofing).not.toBeNull();
  });

  it("returns both estimates when interest is both", () => {
    const result = calculateEstimate({ ...baseSolarInputs, interest: "both" });
    expect(result.solar).not.toBeNull();
    expect(result.roofing).not.toBeNull();
  });

  it("headline contains $ sign", () => {
    const resultSolar = calculateEstimate({ ...baseSolarInputs, interest: "solar" });
    expect(resultSolar.headline).toContain("$");

    const resultRoof = calculateEstimate({ ...baseSolarInputs, interest: "roof" });
    expect(resultRoof.headline).toContain("$");

    const resultBoth = calculateEstimate({ ...baseSolarInputs, interest: "both" });
    expect(resultBoth.headline).toContain("$");
  });

  it("monthlySavingsDisplay is positive for solar interest", () => {
    const result = calculateEstimate({ ...baseSolarInputs, interest: "solar" });
    expect(result.monthlySavingsDisplay).toBeGreaterThan(0);
  });

  it("paybackDisplay reflects solar payback years for solar interest", () => {
    const result = calculateEstimate({ ...baseSolarInputs, interest: "solar" });
    expect(result.paybackDisplay).toBeGreaterThan(0);
    expect(result.paybackDisplay).toBe(result.solar!.paybackYears);
  });

  it("twentyYearDisplay reflects solar twenty year savings for solar interest", () => {
    const result = calculateEstimate({ ...baseSolarInputs, interest: "solar" });
    expect(result.twentyYearDisplay).toBe(result.solar!.twentyYearSavings);
  });

  it("monthlySavingsDisplay is positive for both interest", () => {
    const result = calculateEstimate({ ...baseSolarInputs, interest: "both" });
    expect(result.monthlySavingsDisplay).toBeGreaterThan(0);
  });
});
