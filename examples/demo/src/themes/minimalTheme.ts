import { createTheme, PaletteOptions, Theme } from '@mui/material';
import { RaThemeOptions, defaultTheme } from 'react-admin';

const alert = {
    error: { main: '#B57185' },
    warning: { main: '#F2CB05' },
    info: { main: '#39AEA9' },
    success: { main: '#00745F' },
};

const darkPalette: PaletteOptions = {
    mode: 'dark' as 'dark',
    primary: { main: '#f9fafb' },
    secondary: { main: '#a0a0a0' },
    background: { default: '#363D40' },
    ...alert,
};

const lightPalette: PaletteOptions = {
    mode: 'light' as 'light',
    primary: { main: '#00585C' },
    secondary: { main: '#64B4B8' },
    background: { default: '#f9fafb' },
    text: { primary: '#212b36' },
    ...alert,
};

const typography = {
    fontFamily: 'Onest, sans-serif',
    fontSize: 12,
    h1: { fontSize: '7rem' },
    h2: { fontWeight: 400 },
    h3: { fontWeight: 500 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
};

const shape = {
    borderRadius: 0,
};

const sidebar = {
    width: 200,
};

const spacing = 8;

const componentsOverrides = (theme: Theme) => ({
    MuiAlert: {
        defaultProps: {
            variant: 'outlined' as const,
        },
    },
    MuiAppBar: {
        styleOverrides: {
            colorSecondary: {
                backgroundColor: theme.palette.background.default,
            },
        },
    },
    MuiButton: {
        defaultProps: {
            variant: 'outlined' as const,
        },
        styleOverrides: {
            root: {
                paddingTop: theme.spacing(0.2),
                paddingBottom: theme.spacing(0.2),
            },
        },
    },
    MuiChip: {
        defaultProps: {
            variant: 'outlined' as const,
        },
    },
    MuiFormControl: {
        defaultProps: {
            variant: 'standard' as const,
            margin: 'dense' as const,
            size: 'small' as const,
        },
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                '&.MuiListItemIcon-root': {
                    minWidth: theme.spacing(3),
                },
            },
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: {
                '&.MuiMenuItem-root': {
                    paddingTop: theme.spacing(0.5),
                    paddingBottom: theme.spacing(0.5),
                },
            },
        },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            input: {
                padding: 16,
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            elevation1: {
                boxShadow: theme.shadows[1],
            },
            root: {
                backgroundColor: theme.palette.background.default,
            },
        },
    },
    MuiSnackbar: {
        styleOverrides: {
            root: {
                '& .RaNotification-error': {
                    border: `1px solid ${theme.palette.error.main}`,
                    backgroundColor: `${theme.palette.common.white} !important`,
                    color: `${theme.palette.error.main} !important`,
                },
                '& .RaNotification-warning': {
                    border: `1px solid ${theme.palette.warning.main}`,
                    backgroundColor: `${theme.palette.common.white} !important`,
                    color: `${theme.palette.warning.main} !important`,
                },
                '& .RaNotification-info': {
                    border: `1px solid ${theme.palette.info.main}`,
                    backgroundColor: `${theme.palette.common.white} !important`,
                    color: `${theme.palette.info.main} !important`,
                },
                '& .RaNotification-success': {
                    border: `1px solid ${theme.palette.success.main}`,
                    backgroundColor: `${theme.palette.common.white} !important`,
                    color: `${theme.palette.success.main} !important`,
                },
            },
        },
    },
    MuiTabs: {
        styleOverrides: {
            root: {
                '&.MuiTabs-root': {
                    minHeight: theme.spacing(3.5),
                },
            },
        },
    },
    MuiTab: {
        styleOverrides: {
            root: {
                '&.MuiTab-root': {
                    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
                    minHeight: theme.spacing(3.5),
                    minWidth: theme.spacing(10),
                },
            },
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                padding: theme.spacing(1),
                '&.MuiTableCell-sizeSmall': {
                    padding: theme.spacing(0.5),
                },
                '&.MuiTableCell-paddingNone': {
                    padding: 0,
                },
            },
        },
    },
    MuiTextField: {
        defaultProps: {
            variant: 'standard' as const,
            margin: 'dense' as const,
            size: 'small' as const,
        },
    },
    MuiToolbar: {
        styleOverrides: {
            root: {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
            },
            regular: {
                backgroundColor: theme.palette.background.paper,
            },
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
    RaMenuItemLink: {
        styleOverrides: {
            root: {
                '&.RaMenuItemLink-active': {
                    color: theme.palette.primary.dark,
                    fontWeight: 700,
                    '& .MuiSvgIcon-root': {
                        fill: theme.palette.primary.dark,
                    },
                },
            },
        },
    },
});

const createMinimalTheme = (themeOptions: RaThemeOptions) => {
    const theme = createTheme(themeOptions);
    theme.components = {
        ...defaultTheme.components,
        ...componentsOverrides(theme),
    };
    return theme;
};

export const minimalLightTheme = createMinimalTheme({
    ...defaultTheme,
    palette: lightPalette,
    shape,
    typography,
    sidebar,
    spacing,
});

export const minimalDarkTheme = createMinimalTheme({
    ...defaultTheme,
    palette: darkPalette,
    shape,
    typography,
    sidebar,
    spacing,
});
