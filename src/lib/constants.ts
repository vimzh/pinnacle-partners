import type { RoofAge, RoofType } from "./types";

export const PANEL_WATTAGE = 400;
export const DEFAULT_COST_PER_WATT = 3.0;
export const FEDERAL_ITC_RATE = 0.3;
export const SQFT_PER_PANEL = 17.5;
export const INSURANCE_SAVINGS_RATE = 0.15;
export const EMERGENCY_PREMIUM_MULTIPLIER = 1.4;

export const ROOF_AGE_YEARS: Record<RoofAge, number> = {
  "<5": 3,
  "5-10": 7,
  "10-20": 15,
  "20+": 25,
};

export const ROOF_MAX_LIFE: Record<RoofType, number> = {
  asphalt: 25,
  metal: 50,
  tile: 50,
  flat: 20,
};

export const ROOF_COST_PER_SQFT: Record<RoofType, number> = {
  asphalt: 4.5,
  metal: 12.0,
  tile: 10.0,
  flat: 6.0,
};

export const SOLAR_PRODUCTION_PER_KW: Record<string, number> = {
  TX: 1550, AZ: 1750, CA: 1600, CO: 1500, FL: 1450,
  GA: 1400, NC: 1350, NV: 1800, NM: 1700, UT: 1550,
  DEFAULT: 1400,
};

export const ELECTRICITY_RATES: Record<string, number> = {
  TX: 0.13, AZ: 0.13, CA: 0.23, CO: 0.14, FL: 0.13,
  GA: 0.12, NC: 0.11, NV: 0.12, NM: 0.13, UT: 0.11,
  DEFAULT: 0.14,
};

export const STATE_REBATES: Record<string, number> = {
  CA: 1500, NY: 2000, NM: 1200, CO: 1000, DEFAULT: 0,
};

export const ZIP_TO_STATE: Record<string, string> = {
  "75": "TX", "76": "TX", "77": "TX", "78": "TX", "79": "TX",
  "85": "AZ", "86": "AZ",
  "90": "CA", "91": "CA", "92": "CA", "93": "CA", "94": "CA", "95": "CA",
  "80": "CO", "81": "CO",
  "32": "FL", "33": "FL", "34": "FL",
  "30": "GA", "31": "GA",
  "27": "NC", "28": "NC",
  "89": "NV",
  "87": "NM", "88": "NM",
  "84": "UT",
  "10": "NY", "11": "NY", "12": "NY", "13": "NY", "14": "NY",
};

export const AVG_ANNUAL_INSURANCE: Record<string, number> = {
  TX: 4200, FL: 4500, CA: 1800, CO: 2800, AZ: 1900,
  GA: 2200, NC: 2000, NV: 1600, NM: 1800, UT: 1200,
  DEFAULT: 2400,
};

export const ROOF_SQFT_MIN = 500;
export const ROOF_SQFT_MAX = 5000;
export const ROOF_SQFT_DEFAULT = 1500;
export const MONTHLY_BILL_MIN = 50;
export const MONTHLY_BILL_MAX = 500;
export const MONTHLY_BILL_DEFAULT = 150;
