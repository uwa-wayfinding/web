'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(savedMode || (prefersDark ? 'dark' : 'light'));
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  const theme = createTheme({
    palette: {
      mode,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#0a0a0a',
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
} 