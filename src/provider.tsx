'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider as JotaiProvider } from 'jotai';
import { useAtom } from 'jotai';
import { getThemeAtom } from '@/lib/theme';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [theme] = useAtom(getThemeAtom);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeWrapper>{children}</ThemeWrapper>
    </JotaiProvider>
  );
} 