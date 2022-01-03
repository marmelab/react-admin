import * as React from 'react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
    Theme,
} from '@mui/material/styles';
import { ThemeOptions } from '@mui/material';
import { ThemeContext, ThemeSetter } from './ThemeContext';

/**
 * This components sets up a React context that provides a function to set the
 * Material-UI theme. It also wraps the children in a Material-UI ThemeProvider.
 * @param props
 * @param props.children The children of the component.
 * @param props.theme The initial theme.
 */
export const ThemeProvider = ({
    children,
    theme: themeOverride,
}: ThemeProviderProps) => {
    const [theme, setTheme] = useTheme(themeOverride);

    return (
        <ThemeContext.Provider value={setTheme}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export interface ThemeProviderProps {
    children: ReactNode;
    theme: ThemeOptions;
}

const useTheme = (themeOverride?: ThemeOptions): [Theme, ThemeSetter] => {
    const themeProp = useRef(themeOverride);
    const [theme, setInnerTheme] = useState(() => createTheme(themeOverride));

    useEffect(() => {
        if (themeProp.current !== themeOverride) {
            themeProp.current = themeOverride;
            setInnerTheme(createTheme(themeOverride));
        }
    }, [themeOverride, themeProp, setInnerTheme]);

    const setTheme = useCallback(
        (theme: ThemeOptions) => {
            setInnerTheme(createTheme(theme));
        },
        [setInnerTheme]
    );

    return [theme, setTheme];
};
