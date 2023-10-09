import { alpha, createTheme, PaletteOptions, Theme } from '@mui/material';
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
        main: '#9055fd',
    },
    secondary: {
        main: '#FF83F6',
    },
    background: {
        default: '#1A0E3E',
    },
    ...alert,
    mode: 'dark' as 'dark',
};

const lightPalette: PaletteOptions = {
    primary: {
        main: '#9055fd',
    },
    secondary: {
        main: '#A270FF',
    },
    background: {
        default: '#f0f1f6',
    },
    text: {
        primary: '#544f5a',
        secondary: '#89868D',
    },
    ...alert,
    mode: 'light' as 'light',
};

const typography = {
    fontFamily: 'Gabarito, sans-serif',
    h1: {
        fontWeight: 500,
        fontSize: '6rem',
    },
    h2: {
        fontWeight: 600,
    },
    h3: {
        fontWeight: 700,
    },
    h4: {
        fontWeight: 800,
    },
    h5: {
        fontWeight: 900,
    },
    button: { textTransform: undefined, fontWeight: 700 },
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

const ItemLink = (theme: Theme) => ({
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
});

const Paper = (theme: Theme) => {
    const shadows = [
        alpha(theme.palette.primary.main, 0.2),
        alpha(theme.palette.primary.main, 0.1),
        alpha(theme.palette.primary.main, 0.05),
    ];
    return {
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
                backgroundColor: theme.palette.background.paper,
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
    ...ItemLink(theme),
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

export const synthwaveLightTheme = createSynthTheme({
    ...defaultTheme,
    palette: lightPalette,
    shape,
    typography,
    sidebar,
    spacing,
});

export const synthwaveDarkTheme = createSynthTheme({
    ...defaultTheme,
    palette: darkPalette,
    shape,
    typography,
    sidebar,
    spacing,
});
