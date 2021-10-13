import * as React from 'react';
import mediaQuery from 'css-mediaquery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

/**
 * Test utility to simulate a device form factor for server-side mediaQueries
 *
 * Do not use inside a browser.
 *
 * @example
 *
 * <DeviceTestWrapper width="sm">
 *     <MyResponsiveComponent />
 * <DeviceTestWrapper>
 */
export const DeviceTestWrapper = ({
    width = 'md',
    children,
}: DeviceTestWrapperProps): JSX.Element => {
    const theme = createTheme();
    // Use https://github.com/ericf/css-mediaquery as polyfill.
    const ssrMatchMedia = query => ({
        matches: mediaQuery.match(query, {
            // The estimated CSS width of the browser.
            // For the sake of this demo, we are using a fixed value.
            // In production, you can look into client-hint https://caniuse.com/#search=client%20hint
            // or user-agent resolution.
            width: theme.breakpoints.values[width],
        }),
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

export interface DeviceTestWrapperProps {
    width: 'md' | 'xs' | 'sm' | 'lg' | 'xl';
    children: JSX.Element;
}
