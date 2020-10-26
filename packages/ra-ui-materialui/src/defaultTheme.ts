import { ThemeOptions } from '@material-ui/core';
import { Overrides } from '@material-ui/core/styles/overrides';

export default {
    palette: {
        secondary: {
            light: '#6ec6ff',
            main: '#2196f3',
            dark: '#0069c0',
            contrastText: '#fff',
        },
    },
    typography: {
        h6: {
            fontWeight: 400,
        },
    },
    sidebar: {
        width: 240,
        closedWidth: 55,
    },
    overrides: {
        MuiFilledInput: {
            root: {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                '&$disabled': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
            },
        },
    },
};

// Temporary solution until we specify our components in it like MUI does
// See https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/overrides.d.ts#L103
export interface RaThemeOverrides extends Overrides {
    [key: string]: any;
}

export interface RaThemeOptions extends ThemeOptions {
    sidebar: {
        width: number;
        closedWidth: number;
    };
    overrides: RaThemeOverrides;
}
