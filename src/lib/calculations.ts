import type { CalculatorInputs, SolarEstimate, RoofingEstimate, EstimateResult } from "./types";
import {
  ZIP_TO_STATE,
  SOLAR_PRODUCTION_PER_KW,
  ELECTRICITY_RATES,
  STATE_REBATES,
  AVG_ANNUAL_INSURANCE,
  ROOF_COST_PER_SQFT,
  ROOF_MAX_LIFE,
  ROOF_AGE_YEARS,
  PANEL_WATTAGE,
  DEFAULT_COST_PER_WATT,
  FEDERAL_ITC_RATE,
  SQFT_PER_PANEL,
  INSURANCE_SAVINGS_RATE,
  EMERGENCY_PREMIUM_MULTIPLIER,
} from "./constants";

export const getStateFromZip = (zip: string): string => {
  if (zip.length < 2) return "DEFAULT";
  const prefix = zip.slice(0, 2);
  return ZIP_TO_STATE[prefix] ?? "DEFAULT";
};

export const calculateSolarEstimate = (inputs: CalculatorInputs): SolarEstimate => {
  const state = getStateFromZip(inputs.zipCode);

  const productionPerKw = SOLAR_PRODUCTION_PER_KW[state] ?? SOLAR_PRODUCTION_PER_KW["DEFAULT"];
  const localRatePerKwh = ELECTRICITY_RATES[state] ?? ELECTRICITY_RATES["DEFAULT"];
  const stateRebates = STATE_REBATES[state] ?? STATE_REBATES["DEFAULT"];

  // System sizing: number of panels based on roof sqft
  const numPanels = inputs.roofSqft / SQFT_PER_PANEL;
  const systemKw = (numPanels * PANEL_WATTAGE) / 1000;

  const systemCost = systemKw * 1000 * DEFAULT_COST_PER_WATT;
  const federalItc = systemCost * FEDERAL_ITC_RATE;
  const netCost = systemCost - federalItc - stateRebates;

  const annualKwhProduction = systemKw * productionPerKw;
  const annualSavings = annualKwhProduction * localRatePerKwh;
  const monthlySavings = annualSavings / 12;

  const paybackYears = annualSavings > 0 ? netCost / annualSavings : 0;
  const twentyYearSavings = annualSavings * 20 - netCost;

  return {
    annualKwhProduction,
    localRatePerKwh,
    annualSavings,
    systemCost,
    federalItc,
    stateRebates,
    netCost,
    paybackYears,
    twentyYearSavings,
    monthlySavings,
  };
};

export const calculateRoofingEstimate = (inputs: CalculatorInputs): RoofingEstimate => {
  const state = getStateFromZip(inputs.zipCode);

  const costPerSqft = ROOF_COST_PER_SQFT[inputs.roofType];
  const maxLife = ROOF_MAX_LIFE[inputs.roofType];
  const ageYears = ROOF_AGE_YEARS[inputs.roofAge];
  const avgInsurance = AVG_ANNUAL_INSURANCE[state] ?? AVG_ANNUAL_INSURANCE["DEFAULT"];

  const replacementCost = inputs.roofSqft * costPerSqft;
  const emergencyPremium = replacementCost * EMERGENCY_PREMIUM_MULTIPLIER;
  const remainingLife = Math.max(0, maxLife - ageYears);
  const insuranceSavingsAnnual = avgInsurance * INSURANCE_SAVINGS_RATE;
  const totalSavings =
    (emergencyPremium - replacementCost) + (insuranceSavingsAnnual * remainingLife);

  return {
    replacementCost,
    emergencyPremium,
    remainingLife,
    insuranceSavingsAnnual,
    totalSavings,
  };
};

export const calculateEstimate = (inputs: CalculatorInputs): EstimateResult => {
  const solar =
    inputs.interest === "solar" || inputs.interest === "both"
      ? calculateSolarEstimate(inputs)
      : null;

  const roofing =
    inputs.interest === "roof" || inputs.interest === "both"
      ? calculateRoofingEstimate(inputs)
      : null;

  // Display values — solar takes precedence when both are present
  const monthlySavingsDisplay = solar
    ? solar.monthlySavings
    : roofing
    ? roofing.insuranceSavingsAnnual / 12
    : 0;

  const paybackDisplay = solar ? solar.paybackYears : 0;
  const twentyYearDisplay = solar ? solar.twentyYearSavings : 0;

  const savingsFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(monthlySavingsDisplay);

  const headline = solar
    ? `Save ${savingsFormatted}/mo with solar`
    : roofing
    ? `Save ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(roofing.totalSavings)} with a new roof`
    : `Save ${savingsFormatted} on your home energy costs`;

  return {
    solar,
    roofing,
    headline,
    monthlySavingsDisplay,
    paybackDisplay,
    twentyYearDisplay,
  };
};
