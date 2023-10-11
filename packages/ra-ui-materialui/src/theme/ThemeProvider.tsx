import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import { RaThemeOptions } from './types';
import { useTheme } from './useTheme';
import { useThemesContext } from './useThemesContext';

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
export const ThemeProvider = ({
    children,
    theme: themeOverride,
}: ThemeProviderProps) => {
    const { lightTheme, darkTheme, defaultTheme } = useThemesContext();

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    const [mode] = useTheme(
        defaultTheme || (prefersDarkMode && darkTheme ? 'dark' : 'light')
    );

    const themeValue = useMemo(() => {
        try {
            return createTheme(
                typeof mode === 'object'
                    ? mode // FIXME: legacy useTheme, to be removed in v5
                    : mode === 'dark'
                    ? darkTheme
                    : lightTheme || themeOverride
            );
        } catch (e) {
            console.warn('Failed to reuse custom theme from store', e);
            return createTheme();
        }
    }, [mode, themeOverride, lightTheme, darkTheme]);

    return <MuiThemeProvider theme={themeValue}>{children}</MuiThemeProvider>;
};

export interface ThemeProviderProps {
    children: ReactNode;
    /**
     * @deprecated Use the `ThemesProvider` component instead.
     */
    theme?: RaThemeOptions;
}
