import { ThemeOptions } from '@mui/material';

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
            variants: [
                {
                    props: {},
                    style: ({ theme }) => ({
                        [theme.breakpoints.down('sm')]: {
                            // @see MuiTextField.styleOverrides.root
                            width: '100%',
                        },
                    }),
                },
            ],
        },
        MuiFilledInput: {
            variants: [
                {
                    props: {},
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        '&$disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                    },
                },
            ],
        },
        MuiTextField: {
            defaultProps: {
                variant: 'filled' as const,
                margin: 'dense' as const,
                size: 'small' as const,
            },
            variants: [
                {
                    props: {},
                    style: ({ theme }) => ({
                        [theme.breakpoints.down('sm')]: {
                            // @see MuiTextField.styleOverrides.root
                            width: '100%',
                        },
                    }),
                },
            ],
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'filled' as const,
                margin: 'dense' as const,
                size: 'small' as const,
            },
        },
        RaSelectArrayInput: {
            variants: [
                {
                    props: {},
                    style: ({ theme }) => ({
                        [theme.breakpoints.down('sm')]: {
                            // @see MuiTextField.styleOverrides.root
                            width: '100%',
                        },
                    }),
                },
            ],
        },
    },
};

export interface RaThemeOptions extends ThemeOptions {
    sidebar?: {
        width?: number;
        closedWidth?: number;
    };
}
