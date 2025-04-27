import { atom } from 'jotai';
import { createTheme } from '@mui/material/styles';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const savedMode = localStorage.getItem('theme') as 'light' | 'dark';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return savedMode || (prefersDark ? 'dark' : 'light');
};

export const themeModeAtom = atom<'light' | 'dark'>(getInitialTheme());

export const toggleThemeAtom = atom(
  null,
  (get, set) => {
    const currentMode = get(themeModeAtom);
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    set(themeModeAtom, newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newMode);
    }
  }
);

export const getThemeAtom = atom((get) => {
  const mode = get(themeModeAtom);
  return mode === 'light' ? lightTheme : darkTheme;
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
}); 