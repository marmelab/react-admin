import { createContext } from 'react';
import { DeprecatedThemeOptions } from '@mui/material';

export const ThemeContext = createContext<ThemeSetter>(null);

export type ThemeSetter = (theme: DeprecatedThemeOptions) => void;
