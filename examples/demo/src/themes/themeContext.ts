import { createContext } from 'react';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

export const ThemeContext = createContext({
    theme: {
        name: 'light',
        theme: lightTheme,
    },
    changeTheme: theme => {},
});

export type ThemeType = 'light' | 'dark' | 'synthwave';
export const themes = [
    { name: 'light', theme: lightTheme },
    { name: 'dark', theme: darkTheme },
];
