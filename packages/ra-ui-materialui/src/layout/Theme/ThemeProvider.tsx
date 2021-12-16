import * as React from 'react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
    Theme,
} from '@mui/material/styles';
import { DeprecatedThemeOptions } from '@mui/material';
import { ThemeContext, ThemeSetter } from './ThemeContext';

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
    theme: DeprecatedThemeOptions;
}

const useTheme = (
    themeOverride?: DeprecatedThemeOptions
): [Theme, ThemeSetter] => {
    const themeProp = useRef(themeOverride);
    const [theme, setInnerTheme] = useState(() => createTheme(themeOverride));

    useEffect(() => {
        if (themeProp.current !== themeOverride) {
            themeProp.current = themeOverride;
            setInnerTheme(createTheme(themeOverride));
        }
    }, [themeOverride, themeProp, setInnerTheme]);

    const setTheme = useCallback(
        (theme: DeprecatedThemeOptions) => {
            setInnerTheme(createTheme(theme));
        },
        [setInnerTheme]
    );

    return [theme, setTheme];
};
