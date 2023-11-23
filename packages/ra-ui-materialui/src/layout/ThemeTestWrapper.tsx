import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

/**
 * Test utility to simulate a preferred theme mode (light or dark)
 *
 * Do not use inside a browser.
 *
 * @example
 *
 * <ThemeTestWrapper mode="dark">
 *     <MyComponent />
 * <ThemeTestWrapper>
 */
export const ThemeTestWrapper = ({
    mode = 'light',
    children,
}: ThemeTestWrapperProps): JSX.Element => {
    const theme = createTheme();
    const ssrMatchMedia = query => ({
        matches:
            mode === 'dark' && query === '(prefers-color-scheme: dark)'
                ? true
                : false,
        addListener: () => {},
        removeListener: () => {},
    });

    return (
        <ThemeProvider
            theme={{
                ...theme,
                components: {
                    MuiUseMediaQuery: {
                        defaultProps: {
                            ssrMatchMedia,
                            matchMedia: ssrMatchMedia,
                        },
                    },
                },
            }}
        >
            {children}
        </ThemeProvider>
    );
};

export interface ThemeTestWrapperProps {
    mode: 'light' | 'dark';
    children: JSX.Element;
}
