import { useStore } from 'ra-core';
import { ThemeOptions, useTheme as useThemeMUI } from '@mui/material';

export type ThemeSetter = (theme: ThemeOptions) => void;

export const useTheme = (
    themeOverride?: ThemeOptions
): [ThemeOptions, ThemeSetter] => {
    const themeMUI = useThemeMUI();
    const [theme, setter] = useStore('theme', themeOverride);
    return [theme || themeMUI, setter];
};
