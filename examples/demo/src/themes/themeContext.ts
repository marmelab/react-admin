import { createContext } from 'react';
import {
    RaThemeOptions,
    defaultLightTheme,
    defaultDarkTheme,
} from 'react-admin';
import { softDarkTheme, softLightTheme } from './softTheme';
import { nanoDarkTheme, nanoLightTheme } from './nanoTheme';
import { chiptuneTheme } from './chiptuneTheme';
import { synthwaveDarkTheme, synthwaveLightTheme } from './synthwaveTheme';
import { ecoDarkTheme, ecoLightTheme } from './ecoTheme';
import { houseDarkTheme, houseLightTheme } from './houseTheme';

export const ThemeContext = createContext<ThemeContextProps>({
    theme: {
        name: 'soft',
        light: softLightTheme,
        dark: softDarkTheme,
    },
    changeTheme: () => {},
});

export type ThemeType =
    | 'soft'
    | 'default'
    | 'nano'
    | 'synthwave'
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
    { name: 'soft', light: softLightTheme, dark: softDarkTheme },
    { name: 'default', light: defaultLightTheme, dark: defaultDarkTheme },
    { name: 'nano', light: nanoLightTheme, dark: nanoDarkTheme },
    { name: 'synthwave', light: synthwaveLightTheme, dark: synthwaveDarkTheme },
    { name: 'chiptune', light: chiptuneTheme },
    { name: 'eco', light: ecoLightTheme, dark: ecoDarkTheme },
    { name: 'house', light: houseLightTheme, dark: houseDarkTheme },
];
