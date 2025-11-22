import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export type Theme = {
  background: string;
  surface: string;
  surfaceBorder: string;
  primary: string;
  textPrimary: string;
  textSecondary: string;
  inputBackground: string;
  inputBorder: string;
  isDark: boolean;
};

const lightTheme: Theme = {
  background: '#f9fafb',
  surface: '#ffffff',
  surfaceBorder: '#e5e7eb',
  primary: '#00C853',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  inputBackground: '#ffffff',
  inputBorder: '#d1d5db',
  isDark: false,
};

const darkTheme: Theme = {
  background: '#1a1a1a',
  surface: '#2d2d2d',
  surfaceBorder: '#3d3d3d',
  primary: '#00C853',
  textPrimary: '#ffffff',
  textSecondary: '#a0a0a0',
  inputBackground: '#2d2d2d',
  inputBorder: '#3d3d3d',
  isDark: true,
};

export const ThemeContext = createContext<Theme>(darkTheme);

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
