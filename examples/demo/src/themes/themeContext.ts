import { createContext } from 'react';
import { RaThemeOptions } from 'react-admin';
import { chiptuneTheme } from './chiptuneTheme';
import { synthwaveDarkTheme, synthwaveLightTheme } from './synthwaveTheme';
import { minimalDarkTheme, minimalLightTheme } from './minimalTheme';
import { ecoDarkTheme, ecoLightTheme } from './ecoTheme';
import { houseDarkTheme, houseLightTheme } from './houseTheme';
import { basicDarkTheme, basicLightTheme } from './basicTheme';

export const ThemeContext = createContext<ThemeContextProps>({
    theme: {
        name: 'basic',
        light: basicLightTheme,
        dark: basicDarkTheme,
    },
    changeTheme: () => {},
});

export type ThemeType =
    | 'basic'
    | 'synthwave'
    | 'minimal'
    | 'chiptune'
    | 'eco'
    | 'house';
export interface Theme {
    name: ThemeType;
    light: RaThemeOptions;
    dark?: RaThemeOptions;
}

export interface ThemeContextProps {
    theme: Theme;
    changeTheme: (theme: Theme) => void;
}

export const themes: Theme[] = [
    { name: 'basic', light: basicLightTheme, dark: basicDarkTheme },
    { name: 'synthwave', light: synthwaveLightTheme, dark: synthwaveDarkTheme },
    { name: 'minimal', light: minimalLightTheme, dark: minimalDarkTheme },
    { name: 'chiptune', light: chiptuneTheme },
    { name: 'eco', light: ecoLightTheme, dark: ecoDarkTheme },
    { name: 'house', light: houseLightTheme, dark: houseDarkTheme },
];
