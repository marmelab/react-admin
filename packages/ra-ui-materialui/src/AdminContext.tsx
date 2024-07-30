import * as React from 'react';
import { CoreAdminContext, CoreAdminContextProps } from 'ra-core';

import {
    ThemeProvider,
    ThemesContext,
    RaThemeOptions,
    defaultLightTheme,
    defaultDarkTheme,
} from './theme';

export const AdminContext = (props: AdminContextProps) => {
    const {
        theme,
        lightTheme = defaultLightTheme,
        darkTheme,
        defaultTheme,
        children,
        ...rest
    } = props;
    return (
        <CoreAdminContext {...rest}>
            <ThemesContext.Provider
                value={{
                    lightTheme: theme || lightTheme,
                    darkTheme:
                        theme && !darkTheme
                            ? undefined
                            : !darkTheme && darkTheme !== null
                              ? defaultDarkTheme
                              : darkTheme ?? undefined,
                    defaultTheme,
                }}
            >
                <ThemeProvider>{children}</ThemeProvider>
            </ThemesContext.Provider>
        </CoreAdminContext>
    );
};

export interface AdminContextProps extends CoreAdminContextProps {
    /**
     * The material-UI theme to customize the UI
     *
     * @see https://marmelab.com/react-admin/Admin.html#theme
     * @example
     * import { Admin, defaultTheme } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     *
     * const theme = {
     *     ...defaultTheme,
     *     palette: { mode: 'dark' },
     * };
     *
     * const App = () => (
     *     <Admin theme={theme} dataProvider={dataProvider}>
     *         ...
     *     </Admin>
     * );
     */
    theme?: object;

    /**
     * The material-UI theme to customize the UI. Prefer the theme prop.
     * If not provided, the default light theme is used.
     *
     * @see https://marmelab.com/react-admin/Admin.html#theme
     */
    lightTheme?: RaThemeOptions;

    /**
     * The material-UI theme to apply to the UI when the dark mode is activated.
     * If not provided, the default dark theme is used.
     * If set to null, the dark mode is disabled.
     *
     * @see https://marmelab.com/react-admin/Admin.html#darktheme
     * @example
     * import { Admin } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     * import { darkTheme, lightTheme } from './themes';
     *
     * const App = () => (
     *     <Admin
     *         dataProvider={dataProvider}
     *         theme={lightTheme}
     *         darkTheme={darkTheme}
     *     >
     *         ...
     *     </Admin>
     * );
     */
    darkTheme?: RaThemeOptions | null;

    /**
     * The default theme to use when the user hasn't chosen a theme yet.
     *
     * @see https://marmelab.com/react-admin/Admin.html#defaulttheme
     * @example
     * import { Admin } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     * import { darkTheme, lightTheme } from './themes';
     *
     * const App = () => (
     *     <Admin
     *         dataProvider={dataProvider}
     *         theme={lightTheme}
     *         darkTheme={darkTheme}
     *         defaultTheme="dark"
     *     >
     *         ...
     *     </Admin>
     * );
     */
    defaultTheme?: 'light' | 'dark';
}

AdminContext.displayName = 'AdminContext';
