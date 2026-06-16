"use client";
import { createContext, useContext } from "react";

export type PlanContextType = {
  isFreeUser: boolean;
  hasProPlan: boolean;
  hasEnterprisePlan: boolean;
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

interface PlanProviderProps {
  children: React.ReactNode;
  hasProPlan: boolean;
  hasEnterprisePlan: boolean;
}

export function PlanProvider({
  children,
  hasProPlan,
  hasEnterprisePlan,
}: PlanProviderProps) {
  return (
    <PlanContext.Provider
      value={{
        isFreeUser: !hasProPlan && !hasEnterprisePlan,
        hasProPlan,
        hasEnterprisePlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
