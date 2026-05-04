'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'monitoring' | 'alert';
type IncidentStatus = 'none' | 'detected' | 'approved' | 'ignored';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isAutoMode: boolean;
  setIsAutoMode: (auto: boolean) => void;
  incidentStatus: IncidentStatus;
  setIncidentStatus: (status: IncidentStatus) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('monitoring');
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [incidentStatus, setIncidentStatus] = useState<IncidentStatus>('none');

  useEffect(() => {
    // Apply data-theme attribute to html tag for CSS variable switching
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'monitoring' ? 'alert' : 'monitoring'));
  };

  return (
    <ThemeContext.Provider value={{ 
      mode, 
      setMode, 
      toggleTheme, 
      isAutoMode, 
      setIsAutoMode, 
      incidentStatus, 
      setIncidentStatus 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
