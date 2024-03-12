import {
    alpha,
    createTheme,
    darken,
    Theme,
    PaletteOptions,
} from '@mui/material';
import { RaThemeOptions } from './types';

/**
 * House: A young and joyful theme.
 *
 * Uses rounded corners, blurry backdrop, large padding, and a bright color palette.
 */

const componentsOverrides = (theme: Theme) => ({
    MuiBackdrop: {
        styleOverrides: {
            root: {
                backgroundColor: alpha(darken('#000C57', 0.4), 0.2),
                backdropFilter: 'blur(2px)',
                '&.MuiBackdrop-invisible': {
                    backgroundColor: 'transparent',
                    backdropFilter: 'blur(2px)',
                },
            },
        },
    },
    MuiAutocomplete: {
        defaultProps: {
            fullWidth: true,
        },
    },
    MuiFormControl: {
        defaultProps: {
            margin: 'dense' as const,
            fullWidth: true,
        },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            input: {
                padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
            },
        },
    },
    MuiTab: {
        styleOverrides: {
            root: {
                padding: 0,
                height: 38,
                minHeight: 38,
                borderRadius: 6,
                transition: 'color .2s',

                '&.MuiButtonBase-root': {
                    minWidth: 'auto',
                    paddingLeft: 20,
                    paddingRight: 20,
                    marginRight: 4,
                },
                '&.Mui-selected, &.Mui-selected:hover': {
                    color: theme.palette.primary.contrastText,
                    zIndex: 5,
                },
                '&:hover': {
                    color: theme.palette.primary.main,
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
    MuiTableCell: {
        styleOverrides: {
            root: {
                padding: theme.spacing(2),
                '&.MuiTableCell-sizeSmall': {
                    padding: theme.spacing(1.5),
                },
                '&.MuiTableCell-paddingNone': {
                    padding: theme.spacing(0.5),
                },
            },
        },
    },
    MuiTabs: {
        styleOverrides: {
            root: {
                height: 38,
                minHeight: 38,
                overflow: 'visible',
            },
            indicator: {
                height: 38,
                minHeight: 38,
                borderRadius: 6,
                border: `1px solid ${theme.palette.primary.light}`,
                boxShadow: theme.shadows[1],
            },
            scrollableX: {
                overflow: 'visible !important',
            },
        },
    },
    MuiTextField: {
        defaultProps: {
            variant: 'outlined' as const,
            fullWidth: true,
        },
    },
    RaAppBar: {
        styleOverrides: {
            root: {
                color: theme.palette.text.primary,
                '& .RaAppBar-toolbar': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.background.default,
                    backgroundImage: `linear-gradient(310deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
                },
            },
        },
    },
    RaMenuItemLink: {
        styleOverrides: {
            root: {
                padding: 10,
                marginRight: 10,
                marginLeft: 10,
                '&:hover': {
                    borderRadius: 5,
                },
                '&.RaMenuItemLink-active': {
                    borderRadius: 10,
                    backgroundColor: theme.palette.common.white,
                    color: theme.palette.primary.main,
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: '0; right: 0; bottom: 0; left: 0',
                        zIndex: '-1',
                        margin: '-2px',
                        borderRadius: '12px',
                        background: `linear-gradient(310deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
                    },
                    '& .MuiSvgIcon-root': {
                        fill: theme.palette.primary.main,
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
});

const alert = {
    error: { main: '#DB488B' },
    warning: { main: '#8C701B' },
    info: { main: '#3ED0EB' },
    success: { main: '#0FBF9F' },
};

const darkPalette: PaletteOptions = {
    primary: { main: '#ec7a77', light: '#fbcf33' },
    background: { default: '#363D40', paper: '#2B3033' },
    ...alert,
    mode: 'dark' as 'dark',
};

const lightPalette: PaletteOptions = {
    primary: { main: '#344767', light: '#7928ca' },
    secondary: { main: '#f90283' },
    background: { default: '#f7f8f9', paper: '#ffffff' },
    ...alert,
    mode: 'light' as 'light',
};

const createHouseTheme = (palette: RaThemeOptions['palette']) => {
    const themeOptions = {
        palette,
        shape: { borderRadius: 20 },
        sidebar: { width: 250 },
        spacing: 9,
        typography: { fontFamily: `'Open Sans', sans-serif` },
    };
    const theme = createTheme(themeOptions);
    theme.components = componentsOverrides(theme);
    return theme;
};

export const houseLightTheme = createHouseTheme(lightPalette);
export const houseDarkTheme = createHouseTheme(darkPalette);
