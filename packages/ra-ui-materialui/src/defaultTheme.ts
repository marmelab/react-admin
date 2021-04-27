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
        MuiButtonBase: {
            root: {
                '&:hover:active::after': {
                    // recreate a static ripple color
                    // use the currentColor to make it work both for outlined and contained buttons
                    // but to dim the background without dimming the text,
                    // put another element on top with a limited opacity
                    content: '""',
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'currentColor',
                    opacity: 0.3,
                    borderRadius: 'inherit',
                },
            },
        },
    },
    props: {
        MuiButtonBase: {
            // disable ripple for perf reasons
            disableRipple: true,
        },
    },
};

// Temporary solution until we specify our components in it like MUI does
// See https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/overrides.d.ts#L103
export interface RaThemeOverrides extends Overrides {
    [key: string]: any;
}

export interface RaThemeOptions extends ThemeOptions {
    sidebar?: {
        width?: number;
        closedWidth?: number;
    };
    overrides?: RaThemeOverrides;
}
