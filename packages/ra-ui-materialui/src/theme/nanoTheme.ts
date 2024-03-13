import { createTheme, PaletteOptions, Theme } from '@mui/material';
import { RaThemeOptions } from './types';

/**
 * Nano: A dense theme with minimal chrome, ideal for complex apps.
 *
 * Uses a small font size, reduced spacing, text buttons, standard variant inputs, pale colors.
 */

const componentsOverrides = (theme: Theme) => ({
    MuiAlert: {
        defaultProps: {
            variant: 'outlined' as const,
        },
    },
    MuiAppBar: {
        defaultProps: {
            elevation: 1,
        },
    },
    MuiAutocomplete: {
        defaultProps: {
            fullWidth: true,
        },
        variants: [
            {
                props: {},
                style: ({ theme }: { theme: Theme }) => ({
                    [theme.breakpoints.down('sm')]: { width: '100%' },
                }),
            },
        ],
        styleOverrides: {
            root: {
                '& label+.MuiInput-root.MuiInputBase-root': {
                    marginTop: theme.spacing(1.5),
                },
                '& label[data-shrink=false]+.MuiInput-root.MuiInputBase-root': {
                    marginTop: 0,
                    paddingBottom: theme.spacing(2),
                },
            },
            input: {
                padding: theme.spacing(0.5),
            },
        },
    },
    MuiButton: {
        defaultProps: {
            variant: 'text' as const,
            size: 'small' as const,
        },
        styleOverrides: {
            root: {
                paddingTop: theme.spacing(0.2),
                paddingBottom: theme.spacing(0.2),
            },
        },
    },
    MuiCard: {
        defaultProps: {
            square: true,
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
            fullWidth: true,
        },
    },
    MuiFormHelperText: {
        defaultProps: {
            margin: 'dense' as const,
        },
    },
    MuiIconButton: {
        defaultProps: {
            size: 'small' as const,
        },
    },
    MuiInputBase: {
        styleOverrides: {
            root: {
                'label+&.MuiInputBase-root': {
                    marginTop: theme.spacing(1.5),
                },
                'label[data-shrink=false]+&.MuiInputBase-root': {
                    marginTop: 0,
                    paddingBottom: theme.spacing(1.5),
                },
            },
            input: {
                padding: theme.spacing(0.5),
            },
        },
    },
    MuiInputLabel: {
        styleOverrides: {
            root: {
                paddingLeft: theme.spacing(0.5),
            },
        },
        defaultProps: {
            margin: 'dense' as const,
        },
    },
    MuiListItem: {
        defaultProps: {
            dense: true,
        },
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                '&.MuiListItemIcon-root': {
                    minWidth: theme.spacing(3.5),
                },
            },
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: {
                paddingTop: theme.spacing(0.5),
                paddingBottom: theme.spacing(0.5),
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(1),
            },
        },
    },
    MuiOutlinedInput: {
        defaultProps: {
            margin: 'dense' as const,
        },
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
    MuiTable: {
        defaultProps: {
            size: 'small' as const,
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
            fullWidth: true,
        },
        variants: [
            {
                props: {},
                style: ({ theme }: { theme: Theme }) => ({
                    [theme.breakpoints.down('sm')]: { width: '100%' },
                }),
            },
        ],
    },
    MuiToolbar: {
        defaultProps: {
            variant: 'dense' as const,
        },
        styleOverrides: {
            root: {
                minHeight: theme.spacing(4.5),
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
    RaFilterForm: {
        styleOverrides: {
            root: {
                [theme.breakpoints.up('sm')]: {
                    minHeight: theme.spacing(7.1),
                },
            },
        },
    },
    RaFilterFormInput: {
        styleOverrides: {
            root: {
                '& .RaFilterFormInput-hideButton': {
                    marginBottom: theme.spacing(0.5),
                },
            },
        },
    },
    RaLayout: {
        styleOverrides: {
            root: {
                '& .RaLayout-appFrame': {
                    marginTop: theme.spacing(5),
                },
            },
        },
    },
    RaLoadingIndicator: {
        styleOverrides: {
            root: {
                '& .RaLoadingIndicator-loader': {
                    top: '20%',
                    left: '20%',
                },
            },
        },
    },
    RaMenuItemLink: {
        styleOverrides: {
            root: {
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(1),
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

const createNanoTheme = (palette: RaThemeOptions['palette']) => {
    const themeOptions = {
        palette,
        shape: { borderRadius: 0 },
        sidebar: {
            width: 200,
            closedWidth: 36,
        },
        spacing: 8,
        typography: {
            fontFamily: 'Onest, sans-serif',
            fontSize: 12,
            h1: { fontSize: '7rem' },
            h2: { fontWeight: 400 },
            h3: { fontWeight: 500 },
            h4: { fontWeight: 700 },
            h5: { fontWeight: 700 },
        },
    };
    const theme = createTheme(themeOptions);
    theme.components = componentsOverrides(theme);
    return theme;
};

export const nanoLightTheme = createNanoTheme(lightPalette);
export const nanoDarkTheme = createNanoTheme(darkPalette);
