import { createContext } from 'react';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { minimalTheme } from './minimalTheme';
import { RaThemeOptions } from 'react-admin';
import { popTheme } from './popTheme';
import { chiptuneTheme } from './chiptuneTheme';
import { coldwaveTheme } from './coldwaveTheme';
import { futureHouseDarkTheme } from './futureHouseDarkTheme';
import { futureHouseLightTheme } from './futureHouseLightTheme';
import { synthwaveLightTheme } from './synthwaveLightTheme';
import { synthwaveDarkTheme } from './synthwaveDarkTheme';

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
    | 'synthwaveDark'
    | 'synthwaveLight'
    | 'minimal'
    | 'pop'
    | 'chiptune'
    | 'coldwaveTheme'
    | 'futureHouseDarkTheme'
    | 'futureHouseLightTheme';
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
    { name: 'synthwaveDark', theme: synthwaveDarkTheme },
    { name: 'synthwaveLight', theme: synthwaveLightTheme },
    { name: 'minimal', theme: minimalTheme },
    { name: 'pop', theme: popTheme },
    { name: 'chiptune', theme: chiptuneTheme },
    { name: 'coldwaveTheme', theme: coldwaveTheme },
    { name: 'futureHouseDarkTheme', theme: futureHouseDarkTheme },
    { name: 'futureHouseLightTheme', theme: futureHouseLightTheme },
];
