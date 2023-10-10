import {
    RaThemeOptions,
    defaultLightTheme,
    defaultDarkTheme,
    nanoDarkTheme,
    nanoLightTheme,
} from 'react-admin';
import { softDarkTheme, softLightTheme } from './softTheme';
import { chiptuneTheme } from './chiptuneTheme';
import { synthwaveDarkTheme, synthwaveLightTheme } from './synthwaveTheme';
import { ecoDarkTheme, ecoLightTheme } from './ecoTheme';
import { houseDarkTheme, houseLightTheme } from './houseTheme';

export type ThemeName =
    | 'soft'
    | 'default'
    | 'nano'
    | 'synthwave'
    | 'chiptune'
    | 'eco'
    | 'house';

export interface Theme {
    name: ThemeName;
    light: RaThemeOptions;
    dark?: RaThemeOptions;
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
