import * as React from 'react';
import { CoreAdminContext, CoreAdminContextProps } from 'ra-core';

import { defaultLightTheme } from './defaultTheme';
import { ThemeProvider, ThemesContext, RaThemeOptions } from './layout/Theme';

export const AdminContext = (props: AdminContextProps) => {
    const {
        theme,
        lightTheme = defaultLightTheme,
        darkTheme,
        defaultToLightTheme,
        children,
        ...rest
    } = props;
    return (
        <CoreAdminContext {...rest}>
            <ThemesContext.Provider
                value={{
                    lightTheme: theme || lightTheme,
                    darkTheme,
                    defaultToLightTheme,
                }}
            >
                <ThemeProvider>{children}</ThemeProvider>
            </ThemesContext.Provider>
        </CoreAdminContext>
    );
};

export interface AdminContextProps extends CoreAdminContextProps {
    lightTheme?: RaThemeOptions;
    darkTheme?: RaThemeOptions;
    defaultToLightTheme?: boolean;
}

AdminContext.displayName = 'AdminContext';
