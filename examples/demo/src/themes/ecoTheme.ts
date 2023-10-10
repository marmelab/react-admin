import { createTheme, PaletteOptions, Theme } from '@mui/material';
import { RaThemeOptions, defaultTheme } from 'react-admin';

const alert = {
    error: {
        main: '#DB488B',
    },
    warning: {
        main: '#F2E963',
    },
    info: {
        main: '#3ED0EB',
    },
    success: {
        main: '#0FBF9F',
    },
};

const darkPalette: PaletteOptions = {
    primary: {
        main: '#56DB5C',
    },
    secondary: {
        main: '#FFEC97',
    },
    background: {
        default: '#1b2635',
    },
    ...alert,
    mode: 'dark' as 'dark',
};

const lightPalette: PaletteOptions = {
    primary: {
        main: '#388e3c',
    },
    secondary: {
        main: '#F2B705',
    },
    background: {
        default: '#f7f9fc',
    },
    ...alert,
    mode: 'light' as 'light',
};

const typography = {
    fontFamily: 'Raleway, sans-serif',
};

const shape = {
    borderRadius: 6,
};

const sidebar = {
    width: 250,
};

const spacing = 10;

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
            variant: 'outlined' as const,
            margin: 'dense' as const,
            padding: 20,
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

const Paper = (theme: Theme) => {
    return {
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
    };
};

const Table = () => ({
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
                padding: 16,
            },
        },
    },
});

const TextField = () => ({
    MuiTextField: {
        defaultProps: {
            variant: 'outlined' as const,
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
                backgroundColor: theme.palette.background.default,
            },
        },
    },
    RaAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                '& .RaAppBar-toolbar': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.background.default,
                },
            },
        },
    },
});

const componentsOverrides = (theme: Theme) => ({
    ...AppBar(theme),
    ...Button(),
    ...Datagrid(theme),
    ...FormControl(),
    ...Input(),
    ...Paper(theme),
    ...Table(),
    ...TextField(),
    ...Toolbar(theme),
});

const createSynthTheme = (themeOptions: RaThemeOptions) => {
    const theme = createTheme(themeOptions);
    theme.components = {
        ...defaultTheme.components,
        ...componentsOverrides(theme),
    };
    return theme;
};

export const ecoLightTheme = createSynthTheme({
    ...defaultTheme,
    palette: lightPalette,
    shape,
    typography,
    sidebar,
    spacing,
});

export const ecoDarkTheme = createSynthTheme({
    ...defaultTheme,
    palette: darkPalette,
    shape,
    typography,
    sidebar,
    spacing,
});
