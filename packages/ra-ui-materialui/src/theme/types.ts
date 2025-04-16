import { ThemeOptions as MuiThemeOptions } from '@mui/material';

export type ComponentsTheme = {
    [key: string]: any;
};

declare module '@mui/material/styles' {
    interface Theme {
        sidebar: {
            width: number;
            closedWidth: number;
        };
    }
    // allow configuration using `createTheme()`
    interface ThemeOptions {
        sidebar?: {
            width?: number;
            closedWidth?: number;
        };
    }
}

export interface RaThemeOptions extends MuiThemeOptions {
    palette?: MuiThemeOptions['palette'] & {
        bulkActionsToolbarBackgroundColor?: string;
    };
    sidebar?: {
        width?: number;
        closedWidth?: number;
    };
    components?: ComponentsTheme;
}

export type ThemeType = 'light' | 'dark';
