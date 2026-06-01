import { useContext } from 'react';
import { ThemeContext } from '@/app/providers/ThemeProvider.jsx';

/** Read/update palette + dark mode. */
export function useTheme() {
  return useContext(ThemeContext);
}
