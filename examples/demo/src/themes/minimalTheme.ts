import { createTheme, PaletteOptions, Theme } from '@mui/material';
import { RaThemeOptions, defaultTheme } from 'react-admin';

const alert = {
    error: {
        main: '#B57185',
    },
    warning: {
        main: '#F2CB05',
    },
    info: {
        main: '#39AEA9',
    },
    success: {
        main: '#00745F',
    },
};

const darkPalette: PaletteOptions = {
    primary: {
        main: '#f9fafb',
    },
    secondary: {
        main: '#a0a0a0',
    },
    background: {
        default: '#363D40',
    },
    ...alert,
    mode: 'dark' as 'dark',
};

const lightPalette: PaletteOptions = {
    primary: {
        main: '#363D40',
    },
    secondary: {
        main: '#6C7A80',
    },
    background: {
        default: '#f9fafb',
    },
    text: {
        primary: '#212b36',
    },
    ...alert,
    mode: 'light' as 'light',
};

const typography = {
    fontFamily: 'Onest, sans-serif',
    h1: {
        fontSize: '7rem',
    },
    h2: {
        fontWeight: 400,
    },
    h3: {
        fontWeight: 500,
    },
    h4: {
        fontWeight: 700,
    },
    h5: {
        fontWeight: 700,
    },
};

const shape = {
    borderRadius: 5,
};

const sidebar = {
    width: 200,
};

const spacing = 8;

const Alert = () => ({
    MuiAlert: {
        defaultProps: {
            variant: 'outlined' as const,
        },
    },
});

const AppBar = (theme: Theme) => ({
    MuiAppBar: {
        styleOverrides: {
            colorSecondary: {
                backgroundColor: theme.palette.background.default,
            },
        },
    },
});

const Button = () => ({
    MuiButton: {
        defaultProps: {
            variant: 'outlined' as const,
        },
    },
});

const Chip = () => ({
    MuiChip: {
        defaultProps: {
            variant: 'outlined' as const,
        },
    },
});

const Datagrid = (theme: Theme) => ({
    RaDatagrid: {
        styleOverrides: {
            root: {
                '& .RaDatagrid-headerCell': {
                    color: theme.palette.primary.main,
                },
            },
        },
    },
});

const FormControl = () => ({
    MuiFormControl: {
        defaultProps: {
            variant: 'standard' as const,
            margin: 'dense' as const,
            size: 'small' as const,
        },
    },
});

const Input = () => ({
    MuiOutlinedInput: {
        styleOverrides: {
            input: {
                padding: 16,
            },
        },
    },
});

const ItemLink = (theme: Theme) => ({
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

const Layout = () => ({
    RaLayout: {
        styleOverrides: {
            root: {
                marginTop: 20,
            },
        },
    },
});

const Notification = (theme: Theme) => ({
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
});

const Pagination = (theme: Theme) => ({
    MuiTablePagination: {
        styleOverrides: {
            root: {
                backgroundClip: 'padding-box',
                boxShadow: theme.shadows[1],
                marginTop: 5,
                borderRadius: theme.shape.borderRadius,
            },
        },
    },
});

const Paper = (theme: Theme) => {
    return {
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: theme.shadows[1],
                },
                root: {
                    backgroundClip: 'padding-box',
                },
            },
        },
    };
};

const TextField = () => ({
    MuiTextField: {
        defaultProps: {
            variant: 'standard' as const,
            margin: 'dense' as const,
            size: 'small' as const,
        },
    },
});

const Toolbar = (theme: Theme) => ({
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
});

const componentsOverrides = (theme: Theme) => ({
    ...Alert(),
    ...AppBar(theme),
    ...Button(),
    ...Chip(),
    ...Datagrid(theme),
    ...FormControl(),
    ...Input(),
    ...ItemLink(theme),
    ...Layout(),
    ...Notification(theme),
    ...Pagination(theme),
    ...Paper(theme),
    ...TextField(),
    ...Toolbar(theme),
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
