import { useContext } from 'react';

import { ThemesContext } from './ThemesContext';
import { RaThemeOptions } from './types';

export const useThemesContext = (params?: UseThemesContextParams) => {
    const { lightTheme, darkTheme, defaultTheme } = params || {};
    const context = useContext(ThemesContext);
    return {
        lightTheme: lightTheme || context.lightTheme,
        darkTheme: darkTheme || context.darkTheme,
        defaultTheme: defaultTheme ?? context.defaultTheme,
    };
};

export interface UseThemesContextParams {
    lightTheme?: RaThemeOptions;
    darkTheme?: RaThemeOptions;
    defaultTheme?: 'dark' | 'light';
    [key: string]: any;
}
