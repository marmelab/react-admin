import * as React from 'react';
import { ReactNode, useMemo } from 'react';
import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from '@mui/material/styles';
import { ThemeOptions } from '@mui/material';

import { useTheme } from './useTheme';

/**
 * This sets the Material-UI theme based on the store.
 *
 * @param props
 * @param props.children The children of the component.
 * @param props.theme The initial theme.
 */
export const ThemeProvider = ({
    children,
    theme: themeOverride,
}: ThemeProviderProps) => {
    const [theme] = useTheme(themeOverride);
    const themeValue = useMemo(() => createTheme(theme), [theme]);

    return <MuiThemeProvider theme={themeValue}>{children}</MuiThemeProvider>;
};

export interface ThemeProviderProps {
    children: ReactNode;
    theme: ThemeOptions;
}
