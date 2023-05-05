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
 * This sets the Material UI theme based on the store.
 *
 * @param props
 * @param props.children The children of the component.
 * @param props.theme The initial theme.
 */
export const ThemeProvider = ({
    children,
    theme: themeOverride,
}: ThemeProviderProps) => {
    const { lightTheme, darkTheme, defaultToLightTheme } = useThemesContext();

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    const [mode] = useTheme(
        prefersDarkMode && !defaultToLightTheme && darkTheme ? 'dark' : 'light'
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
    theme?: RaThemeOptions;
}
