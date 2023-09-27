import { createContext } from 'react';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { synthwaveTheme } from './synthwaveTheme';
import { minimalTheme } from './minimalTheme';
import { RaThemeOptions } from 'react-admin';
import { popTheme } from './popTheme';
import { chiptuneTheme } from './chiptuneTheme';

export const ThemeContext = createContext<ThemeContextProps>({
    theme: {
        name: 'light',
        theme: lightTheme,
    },
    changeTheme: () => {},
});

export type ThemeType =
    | 'light'
    | 'dark'
    | 'synthwave'
    | 'minimal'
    | 'pop'
    | 'chiptune';
export interface Theme {
    name: ThemeType;
    theme: RaThemeOptions;
}

export interface ThemeContextProps {
    theme: Theme;
    changeTheme: (theme: Theme) => void;
}

export const themes: Theme[] = [
    { name: 'light', theme: lightTheme },
    { name: 'dark', theme: darkTheme },
    { name: 'synthwave', theme: synthwaveTheme },
    { name: 'minimal', theme: minimalTheme },
    { name: 'pop', theme: popTheme },
    { name: 'chiptune', theme: chiptuneTheme },
];
