import * as React from 'react';
import mediaQuery from 'css-mediaquery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, {
            width,
        }),
        addListener: () => {},
        removeListener: () => {},
    });
}

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
    const ssrMatchMedia = createMatchMedia(theme.breakpoints.values[width]);

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
