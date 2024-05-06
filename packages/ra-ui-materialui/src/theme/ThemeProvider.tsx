import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import { useTheme } from './useTheme';
import { useThemesContext } from './useThemesContext';
import { AdminChildren } from 'ra-core';

/**
 * This sets the Material UI theme based on the preferred theme type.
 *
 * @param props
 * @param props.children The children of the component.
 * @param {ThemeOptions} props.theme The initial theme. Optional, use the one from the context if not provided.
 *
 * @example
 *
 * import { ThemesContext, ThemeProvider } from 'react-admin';
 *
 * const App = () => (
 *    <ThemesContext.Provider value={{ lightTheme, darkTheme }}>
 *      <ThemeProvider>
 *        <Button>Test</Button>
 *      </ThemeProvider>
 *   </ThemesContext.Provider>
 * );
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const { lightTheme, darkTheme, defaultTheme } = useThemesContext();

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    const [mode] = useTheme(
        defaultTheme || (prefersDarkMode && darkTheme ? 'dark' : 'light')
    );

    const themeValue = useMemo(() => {
        try {
            return createTheme(mode === 'dark' ? darkTheme : lightTheme);
        } catch (e) {
            console.warn('Failed to reuse custom theme from store', e);
            return createTheme();
        }
    }, [mode, lightTheme, darkTheme]);

    return (
        <MuiThemeProvider theme={themeValue}>
            {/* Had to cast here because Provider only accepts ReactNode but we might have a render function */}
            {children as ReactNode}
        </MuiThemeProvider>
    );
};

export interface ThemeProviderProps {
    children: AdminChildren;
}
