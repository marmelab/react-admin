import { useContext } from 'react';
import { DeprecatedThemeOptions } from '@mui/material';
import { ThemeContext, ThemeSetter } from './ThemeContext';

export const useSetTheme = (
    themeOverride?: DeprecatedThemeOptions
): ThemeSetter => {
    const context = useContext(ThemeContext);
    return context;
};
