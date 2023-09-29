import { createContext } from 'react';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { RaThemeOptions } from 'react-admin';
import { chiptuneTheme } from './chiptuneTheme';
import { futureHouseDarkTheme } from './futureHouseDarkTheme';
import { futureHouseLightTheme } from './futureHouseLightTheme';
import { synthwaveDarkTheme, synthwaveLightTheme } from './synthwaveTheme';
import { minimalDarkTheme, minimalLightTheme } from './minimalTheme';
import { ecoDarkTheme, ecoLightTheme } from './ecoTheme';

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
    | 'minimalDark'
    | 'minimalLight'
    | 'chiptune'
    | 'ecoDarkTheme'
    | 'ecoLightTheme'
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
    { name: 'minimalLight', theme: minimalLightTheme },
    { name: 'minimalDark', theme: minimalDarkTheme },
    { name: 'chiptune', theme: chiptuneTheme },
    { name: 'ecoLightTheme', theme: ecoLightTheme },
    { name: 'ecoDarkTheme', theme: ecoDarkTheme },
    { name: 'futureHouseDarkTheme', theme: futureHouseDarkTheme },
    { name: 'futureHouseLightTheme', theme: futureHouseLightTheme },
];
