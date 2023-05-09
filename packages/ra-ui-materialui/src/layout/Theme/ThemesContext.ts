import { createContext } from 'react';
import { RaThemeOptions } from './types';

export const ThemesContext = createContext<ThemesContextValue>({});

export interface ThemesContextValue {
    darkTheme?: RaThemeOptions;
    lightTheme?: RaThemeOptions;
    defaultTheme?: 'dark' | 'light';
}
