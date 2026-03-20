export type RoofAge = "<5" | "5-10" | "10-20" | "20+";
export type RoofType = "asphalt" | "metal" | "tile" | "flat";
export type InterestType = "roof" | "solar" | "both";

export interface CalculatorInputs {
  zipCode: string;
  ownsHome: boolean | null;
  roofSqft: number;
  roofAge: RoofAge;
  roofType: RoofType;
  monthlyBill: number;
  interest: InterestType;
}

export interface SolarEstimate {
  annualKwhProduction: number;
  localRatePerKwh: number;
  annualSavings: number;
  systemCost: number;
  federalItc: number;
  stateRebates: number;
  netCost: number;
  paybackYears: number;
  twentyYearSavings: number;
  monthlySavings: number;
}

export interface RoofingEstimate {
  replacementCost: number;
  emergencyPremium: number;
  remainingLife: number;
  insuranceSavingsAnnual: number;
  totalSavings: number;
}

export interface EstimateResult {
  solar: SolarEstimate | null;
  roofing: RoofingEstimate | null;
  headline: string;
  monthlySavingsDisplay: number;
  paybackDisplay: number;
  twentyYearDisplay: number;
}

export interface LeadInfo {
  fullName: string;
  phone: string;
  email?: string;
}
