import { useContext } from 'react';

import { ThemesContext } from './ThemesContext';
import { RaThemeOptions } from './types';

export const useThemesContext = (params?: UseThemesContextParams) => {
    const { lightTheme, darkTheme } = params || {};
    const context = useContext(ThemesContext);
    return {
        lightTheme: lightTheme || context.lightTheme,
        darkTheme: darkTheme || context.darkTheme,
    };
};

export interface UseThemesContextParams {
    lightTheme?: RaThemeOptions;
    darkTheme?: RaThemeOptions;
    [key: string]: any;
}
