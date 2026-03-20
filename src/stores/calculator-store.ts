import { create } from "zustand";
import type {
  CalculatorInputs,
  EstimateResult,
  LeadInfo,
  RoofAge,
  RoofType,
  InterestType,
} from "@/lib/types";
import { ROOF_SQFT_DEFAULT, MONTHLY_BILL_DEFAULT } from "@/lib/constants";
import { calculateEstimate } from "@/lib/calculations";

interface CalculatorState {
  currentStep: number;
  inputs: CalculatorInputs;
  result: EstimateResult | null;
  lead: LeadInfo;
  isSubmitted: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setZipCode: (zip: string) => void;
  setOwnsHome: (owns: boolean) => void;
  setRoofSqft: (sqft: number) => void;
  setRoofAge: (age: RoofAge) => void;
  setRoofType: (type: RoofType) => void;
  setMonthlyBill: (bill: number) => void;
  setInterest: (interest: InterestType) => void;
  runCalculation: () => void;
  setLeadInfo: (info: Partial<LeadInfo>) => void;
  submitLead: () => void;
  reset: () => void;
}

const initialInputs: CalculatorInputs = {
  zipCode: "",
  ownsHome: null,
  roofSqft: ROOF_SQFT_DEFAULT,
  roofAge: "<5",
  roofType: "asphalt",
  monthlyBill: MONTHLY_BILL_DEFAULT,
  interest: "both",
};

const initialLead: LeadInfo = {
  fullName: "",
  phone: "",
  email: "",
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  currentStep: 1,
  inputs: { ...initialInputs },
  result: null,
  lead: { ...initialLead },
  isSubmitted: false,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  setZipCode: (zip) => set((s) => ({ inputs: { ...s.inputs, zipCode: zip } })),
  setOwnsHome: (owns) => set((s) => ({ inputs: { ...s.inputs, ownsHome: owns } })),
  setRoofSqft: (sqft) => set((s) => ({ inputs: { ...s.inputs, roofSqft: sqft } })),
  setRoofAge: (age) => set((s) => ({ inputs: { ...s.inputs, roofAge: age } })),
  setRoofType: (type) => set((s) => ({ inputs: { ...s.inputs, roofType: type } })),
  setMonthlyBill: (bill) => set((s) => ({ inputs: { ...s.inputs, monthlyBill: bill } })),
  setInterest: (interest) => set((s) => ({ inputs: { ...s.inputs, interest: interest } })),

  runCalculation: () => {
    const { inputs } = get();
    const result = calculateEstimate(inputs);
    set({ result });
  },

  setLeadInfo: (info) => set((s) => ({ lead: { ...s.lead, ...info } })),

  submitLead: () => {
    const { inputs, result, lead } = get();
    console.log("Lead submitted:", { inputs, result, lead });
    set({ isSubmitted: true });
  },

  reset: () =>
    set({
      currentStep: 1,
      inputs: { ...initialInputs },
      result: null,
      lead: { ...initialLead },
      isSubmitted: false,
    }),
}));
