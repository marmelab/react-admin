import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { CSSProperties } from 'react';

type Width = CSSProperties['width'];

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        sidebar?: {
            width: Width;
            closedWidth: Width;
        };
    }
    interface ThemeOptions {
        sidebar?: {
            width: Width;
            closedWidth: Width;
        };
    }
}

const defaultTheme: ThemeOptions = {
    palette: {
        secondary: {
            light: '#6ec6ff',
            main: '#2196f3',
            dark: '#0069c0',
            contrastText: '#fff',
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

export default defaultTheme;
