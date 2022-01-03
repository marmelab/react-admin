import { createContext } from 'react';
import { ThemeOptions } from '@mui/material';

export const ThemeContext = createContext<ThemeSetter>(null);

export type ThemeSetter = (theme: ThemeOptions) => void;
