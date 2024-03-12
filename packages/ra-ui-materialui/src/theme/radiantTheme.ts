import { alpha, createTheme, PaletteOptions, Theme } from '@mui/material';
import { RaThemeOptions } from './types';

/**
 * Radiant: A theme emphasizing clarity and ease of use.
 *
 * Uses generous margins, outlined inputs and buttons, no uppercase, and an acid color palette.
 */

const componentsOverrides = (theme: Theme) => {
    const shadows = [
        alpha(theme.palette.primary.main, 0.2),
        alpha(theme.palette.primary.main, 0.1),
        alpha(theme.palette.primary.main, 0.05),
    ];
    return {
        MuiAppBar: {
            styleOverrides: {
                colorSecondary: {
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                },
            },
        },
        MuiAutocomplete: {
            defaultProps: {
                fullWidth: true,
            },
        },
        MuiButton: {
            defaultProps: {
                variant: 'outlined' as const,
            },
            styleOverrides: {
                sizeSmall: {
                    padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
                },
            },
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'outlined' as const,
                margin: 'dense' as const,
                size: 'small' as const,
                fullWidth: true,
            },
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: `${shadows[0]} -2px 2px, ${shadows[1]} -4px 4px,${shadows[2]} -6px 6px`,
                },
                root: {
                    backgroundClip: 'padding-box',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: theme.spacing(1.5),
                    '&.MuiTableCell-sizeSmall': {
                        padding: theme.spacing(1),
                    },
                    '&.MuiTableCell-paddingNone': {
                        padding: 0,
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:last-child td': { border: 0 },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined' as const,
                margin: 'dense' as const,
                size: 'small' as const,
                fullWidth: true,
            },
        },
        RaDatagrid: {
            styleOverrides: {
                root: {
                    '& .RaDatagrid-headerCell': {
                        color: theme.palette.primary.main,
                    },
                },
            },
        },
        RaFilterForm: {
            styleOverrides: {
                root: {
                    [theme.breakpoints.up('sm')]: {
                        minHeight: theme.spacing(6),
                    },
                },
            },
        },
        RaLayout: {
            styleOverrides: {
                root: {
                    '& .RaLayout-appFrame': { marginTop: theme.spacing(5) },
                },
            },
        },
        RaMenuItemLink: {
            styleOverrides: {
                root: {
                    borderLeft: `3px solid ${theme.palette.primary.contrastText}`,
                    '&:hover': {
                        borderRadius: '0px 100px 100px 0px',
                    },
                    '&.RaMenuItemLink-active': {
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        borderRadius: '0px 100px 100px 0px',
                        backgroundImage: `linear-gradient(98deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark} 94%)`,
                        boxShadow: theme.shadows[1],
                        color: theme.palette.primary.contrastText,

                        '& .MuiSvgIcon-root': {
                            fill: theme.palette.primary.contrastText,
                        },
                    },
                },
            },
        },
        RaSimpleFormIterator: {
            defaultProps: {
                fullWidth: true,
            },
        },
        RaTranslatableInputs: {
            defaultProps: {
                fullWidth: true,
            },
        },
    };
};

const alert = {
    error: { main: '#DB488B' },
    warning: { main: '#F2E963' },
    info: { main: '#3ED0EB' },
    success: { main: '#0FBF9F' },
};

const darkPalette: PaletteOptions = {
    primary: { main: '#9055fd' },
    secondary: { main: '#FF83F6' },
    background: { default: '#110e1c', paper: '#151221' },
    ...alert,
    mode: 'dark' as 'dark',
};

const lightPalette: PaletteOptions = {
    primary: { main: '#9055fd' },
    secondary: { main: '#A270FF' },
    background: { default: '#f0f1f6' },
    text: {
        primary: '#544f5a',
        secondary: '#89868D',
    },
    ...alert,
    mode: 'light' as 'light',
};

const createRadiantTheme = (palette: RaThemeOptions['palette']) => {
    const themeOptions = {
        palette,
        shape: { borderRadius: 6 },
        sidebar: { width: 250 },
        spacing: 10,
        typography: {
            fontFamily: 'Gabarito, tahoma, sans-serif',
            h1: {
                fontWeight: 500,
                fontSize: '6rem',
            },
            h2: { fontWeight: 600 },
            h3: { fontWeight: 700 },
            h4: { fontWeight: 800 },
            h5: { fontWeight: 900 },
            button: { textTransform: undefined, fontWeight: 700 },
        },
    };
    const theme = createTheme(themeOptions);
    theme.components = componentsOverrides(theme);
    return theme;
};

export const radiantLightTheme = createRadiantTheme(lightPalette);
export const radiantDarkTheme = createRadiantTheme(darkPalette);
