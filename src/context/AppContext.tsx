import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TravelIntent, TravelPackage, Quote, Booking } from '../types';
import { mockPackages } from '../data/mockData';

interface AppContextType {
  currentIntent: TravelIntent | null;
  setCurrentIntent: (intent: TravelIntent) => void;
  packages: TravelPackage[];
  setPackages: (packages: TravelPackage[]) => void;
  selectedPackage: TravelPackage | null;
  setSelectedPackage: (pkg: TravelPackage | null) => void;
  currentQuote: Quote | null;
  setCurrentQuote: (quote: Quote | null) => void;
  currentBooking: Booking | null;
  setCurrentBooking: (booking: Booking | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentIntent, setCurrentIntent] = useState<TravelIntent | null>(null);
  const [packages, setPackages] = useState<TravelPackage[]>(mockPackages);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  return (
    <AppContext.Provider
      value={{
        currentIntent,
        setCurrentIntent,
        packages,
        setPackages,
        selectedPackage,
        setSelectedPackage,
        currentQuote,
        setCurrentQuote,
        currentBooking,
        setCurrentBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
