"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TalentContextProps {
  selectedTalentId: string | null;
  setSelectedTalentId: (id: string) => void;
}

const TalentContext = createContext<TalentContextProps | undefined>(undefined);

export const TalentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);

  return (
    <TalentContext.Provider value={{ selectedTalentId, setSelectedTalentId }}>
      {children}
    </TalentContext.Provider>
  );
};

export const useTalentContext = () => {
  const context = useContext(TalentContext);
  if (!context) {
    throw new Error("useTalentContext must be used within a TalentProvider");
  }
  return context;
};
