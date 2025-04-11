import {
    RaThemeOptions,
    defaultLightTheme,
    defaultDarkTheme,
    nanoDarkTheme,
    nanoLightTheme,
    radiantDarkTheme,
    radiantLightTheme,
    houseDarkTheme,
    houseLightTheme,
    bwLightTheme,
    bwDarkTheme,
} from 'react-admin';

import { softDarkTheme, softLightTheme } from './softTheme';
import { chiptuneTheme } from './chiptuneTheme';
import { cssVariablesTheme } from './cssVariablesTheme';

export type ThemeName =
    | 'soft'
    | 'B&W'
    | 'default'
    | 'nano'
    | 'radiant'
    | 'house'
    | 'chiptune'
    | 'cssVariables';

export type Theme = {
    name: ThemeName;
    light?: RaThemeOptions;
    dark?: RaThemeOptions;
    single?: RaThemeOptions;
};

const BW_SIDEBAR_OVERRIDE = {
    styleOverrides: {
        root: {
            '& .SubMenu .MuiMenuItem-root': {
                paddingLeft: 24,
            },
            '& .RaMenu-closed .SubMenu .MuiMenuItem-root': {
                paddingLeft: 8,
            },
        },
    },
};

export const themes: Theme[] = [
    { name: 'soft', light: softLightTheme, dark: softDarkTheme },
    {
        name: 'cssVariables',
        single: cssVariablesTheme,
    },
    { name: 'default', light: defaultLightTheme, dark: defaultDarkTheme },
    {
        name: 'B&W',
        light: {
            ...bwLightTheme,
            components: {
                ...bwLightTheme.components,
                RaSidebar: BW_SIDEBAR_OVERRIDE,
            },
        },
        dark: {
            ...bwDarkTheme,
            components: {
                ...bwDarkTheme.components,
                RaSidebar: BW_SIDEBAR_OVERRIDE,
            },
        },
    },
    { name: 'nano', light: nanoLightTheme, dark: nanoDarkTheme },
    { name: 'radiant', light: radiantLightTheme, dark: radiantDarkTheme },
    { name: 'house', light: houseLightTheme, dark: houseDarkTheme },
    { name: 'chiptune', light: chiptuneTheme },
];
