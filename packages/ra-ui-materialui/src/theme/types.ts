import { ThemeOptions as MuiThemeOptions } from '@mui/material';

export type ComponentsTheme = {
    [key: string]: any;
};

export interface RaThemeOptions extends MuiThemeOptions {
    sidebar?: {
        width?: number;
        closedWidth?: number;
    };
    components?: ComponentsTheme;
}

export type ThemeType = 'light' | 'dark';
