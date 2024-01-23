import { useStore } from 'ra-core';
import { ThemeType } from './types';
import { useMediaQuery } from '@mui/material';
import { useThemesContext } from './useThemesContext';

export type ThemeSetter = (theme: ThemeType) => void;

/**
 * Read and update the theme mode (light or dark)
 *
 * @example
 * const [theme, setTheme] = useTheme('light');
 * const toggleTheme = () => {
 *    setTheme(theme === 'light' ? 'dark' : 'light');
 * };
 *
 */
export const useTheme = (type?: ThemeType): [ThemeType, ThemeSetter] => {
    const { darkTheme } = useThemesContext();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    const [theme, setter] = useStore<ThemeType>(
        'theme',
        type ?? (prefersDarkMode && darkTheme ? 'dark' : 'light')
    );

    // Ensure that even though the store has its value set to 'dark', we still use the light theme when no dark theme is available
    return [darkTheme != null ? theme : 'light', setter];
};
