import { useStore } from 'ra-core';
import { RaThemeOptions, ThemeType } from './types';
import { useMediaQuery } from '@mui/material';
import { useThemesContext } from './useThemesContext';

export type ThemeSetter = (theme: ThemeType | RaThemeOptions) => void;

/**
 * Read and update the theme mode (light or dark)
 *
 * @example
 * const [theme, setTheme] = useTheme('light');
 * const toggleTheme = () => {
 *    setTheme(theme === 'light' ? 'dark' : 'light');
 * };
 *
 * @example // legacy mode, stores the full theme object
 * // to be removed in v5
 * const [theme, setTheme] = useTheme({
 *    palette: {
 *       type: 'light',
 *   },
 * });
 */
export const useTheme = (
    type?: ThemeType | RaThemeOptions
): [ThemeType | RaThemeOptions, ThemeSetter] => {
    const { darkTheme } = useThemesContext();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    // FIXME: remove legacy mode in v5, and remove the RaThemeOptions type
    const [theme, setter] = useStore<ThemeType | RaThemeOptions>(
        'theme',
        type ?? (prefersDarkMode && darkTheme ? 'dark' : 'light')
    );

    // Ensure that even though the store has its value set to 'dark', we still use the light theme when no dark theme is available
    return [darkTheme != null ? theme : 'light', setter];
};
