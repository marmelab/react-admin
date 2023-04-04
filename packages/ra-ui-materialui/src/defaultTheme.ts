import { ThemeOptions } from '@mui/material';

const inputMinWidth = 222;

export const defaultTheme = {
    palette: {
        background: {
            default: '#fafafb',
        },
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
        closedWidth: 50,
    },
    components: {
        MuiAutocomplete: {
            styleOverrides: {
                inputRoot: {
                    minWidth: inputMinWidth,
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    '&$disabled': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'filled' as const,
                margin: 'dense' as const,
                size: 'small' as const,
            },
            styleOverrides: {
                root: {
                    minWidth: inputMinWidth,
                },
            },
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'filled' as const,
                margin: 'dense' as const,
                size: 'small' as const,
            },
            styleOverrides: {
                root: {
                    minWidth: inputMinWidth,
                },
            },
        },
    },
};

export interface RaThemeOptions extends ThemeOptions {
    sidebar?: {
        width?: number;
        closedWidth?: number;
    };
}
