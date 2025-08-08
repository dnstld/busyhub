'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface SharingContextType {
  isSharing: boolean;
  setIsSharing: (sharing: boolean) => void;
}

const SharingContext = createContext<SharingContextType | undefined>(undefined);

export function SharingProvider({ children }: { children: ReactNode }) {
  const [isSharing, setIsSharing] = useState(false);

  return (
    <SharingContext.Provider value={{ isSharing, setIsSharing }}>
      {children}
    </SharingContext.Provider>
  );
}

export function useSharing() {
  const context = useContext(SharingContext);
  if (context === undefined) {
    throw new Error('useSharing must be used within a SharingProvider');
  }
  return context;
}
