'use client';

import { useAtom } from 'jotai';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { themeModeAtom, toggleThemeAtom } from '@/lib/theme';

export function ThemeToggle() {
  const [mode] = useAtom(themeModeAtom);
  const [, toggleTheme] = useAtom(toggleThemeAtom);

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
} 