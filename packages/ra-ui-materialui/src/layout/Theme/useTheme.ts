import { useStore } from 'ra-core';
import { ThemeOptions } from '@mui/material';

export type ThemeSetter = (theme: ThemeOptions) => void;

export const useTheme = (
    themeOverride?: ThemeOptions
): [ThemeOptions, ThemeSetter] => useStore('theme', themeOverride);
