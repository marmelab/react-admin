import {
    alpha,
    createTheme,
    Theme as MuiTheme,
    ThemeOptions,
    Palette as MuiPalette,
    PaletteColor as MuiPaletteColor,
} from '@mui/material/styles';
import { defaultTheme } from 'react-admin';

interface PopTheme extends Omit<MuiTheme, 'palette'> {
    customShadows: CustomShadows;
    palette: PopPalette;
}

interface PopPaletteColor extends MuiPaletteColor {
    lighter: string;
    darker: string;
}

interface PopPalette
    extends Omit<MuiPalette, 'primary' | 'error' | 'success' | 'warning'> {
    primary: PopPaletteColor;
    error: PopPaletteColor;
    success: PopPaletteColor;
    warning: PopPaletteColor;
}

type CustomShadows = {
    z1: string;
    button: string;
    text: string;
};

const typography = {
    htmlFontSize: 16,
    fontFamily: `'Public Sans', sans-serif`,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
        fontWeight: 600,
        fontSize: '2.375rem',
        lineHeight: 1.21,
    },
    h2: {
        fontWeight: 600,
        fontSize: '1.875rem',
        lineHeight: 1.27,
    },
    h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.33,
    },
    h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
    },
    h5: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.5,
    },
    h6: {
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.57,
    },
    caption: {
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
    },
    body1: {
        fontSize: '0.875rem',
        lineHeight: 1.57,
    },
    body2: {
        fontSize: '0.75rem',
        lineHeight: 1.66,
    },
    subtitle1: {
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: 1.57,
    },
    subtitle2: {
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 1.66,
    },
    overline: {
        lineHeight: 1.66,
    },
};

const shape = { borderRadius: 6 };

const palette = {
    common: {
        black: '#000',
        white: '#fff',
    },
    primary: {
        '100': '#bae7ff',
        '200': '#91d5ff',
        '400': '#40a9ff',
        '700': '#0050b3',
        '900': '#002766',
        lighter: '#e6f7ff',
        light: '#69c0ff',
        main: '#1890ff',
        dark: '#096dd9',
        darker: '#003a8c',
        contrastText: '#fff',
    },
    secondary: {
        '100': '#f5f5f5',
        '200': '#f0f0f0',
        '400': '#bfbfbf',
        '600': '#595959',
        '800': '#141414',
        lighter: '#f5f5f5',
        light: '#d9d9d9',
        main: '#8c8c8c',
        dark: '#262626',
        darker: '#000000',
        A100: '#ffffff',
        A200: '#434343',
        A300: '#1f1f1f',
        contrastText: '#ffffff',
    },
    error: {
        lighter: '#fff1f0',
        light: '#ffa39e',
        main: '#ff4d4f',
        dark: '#a8071a',
        darker: '#5c0011',
        contrastText: '#fff',
    },
    warning: {
        lighter: '#fffbe6',
        light: '#ffd666',
        main: '#faad14',
        dark: '#ad6800',
        darker: '#613400',
        contrastText: '#f5f5f5',
    },
    info: {
        lighter: '#e6fffb',
        light: '#5cdbd3',
        main: '#13c2c2',
        dark: '#006d75',
        darker: '#002329',
        contrastText: '#fff',
    },
    success: {
        lighter: '#f6ffed',
        light: '#95de64',
        main: '#52c41a',
        dark: '#237804',
        darker: '#092b00',
        contrastText: '#fff',
    },
    grey: {
        '0': '#ffffff',
        '50': '#fafafa',
        '100': '#f5f5f5',
        '200': '#f0f0f0',
        '300': '#d9d9d9',
        '400': '#bfbfbf',
        '500': '#8c8c8c',
        '600': '#595959',
        '700': '#262626',
        '800': '#141414',
        '900': '#000000',
        A50: '#fafafb',
        A100: '#fafafa',
        A200: '#bfbfbf',
        A400: '#434343',
        A700: '#1f1f1f',
        A800: '#e6ebf1',
    },
    text: { primary: '#262626', secondary: '#8c8c8c', disabled: '#bfbfbf' },
    action: { disabled: '#d9d9d9' },
    divider: '#f0f0f0',
    background: { paper: '#ffffff', default: '#fafafb' },
};

const breakpoints = {
    values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1266,
        xl: 1536,
    },
};

const mixins = {
    toolbar: {
        minHeight: 60,
    },
};

const customShadows = (theme: PopTheme): CustomShadows => ({
    button: `0 2px #0000000b`,
    text: `0 -1px 0 rgb(0 0 0 / 12%)`,
    z1: `0px 2px 8px ${alpha(theme.palette.grey[900], 0.15)}`,
});

const Button = (theme: PopTheme) => {
    const disabledStyle = {
        '&.Mui-disabled': {
            backgroundColor: theme.palette.grey[200],
        },
    };

    return {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    fontWeight: 400,
                },
                contained: {
                    ...disabledStyle,
                },
                outlined: {
                    ...disabledStyle,
                },
            },
        },
    };
};

const Badge = (theme: PopTheme) => ({
    MuiBadge: {
        styleOverrides: {
            standard: {
                minWidth: theme.spacing(2),
                height: theme.spacing(2),
                padding: theme.spacing(0.5),
            },
        },
    },
});

const CardContent = () => ({
    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: 20,
                '&:last-child': {
                    paddingBottom: 20,
                },
            },
        },
    },
});

const Checkbox = (theme: PopTheme) => ({
    MuiCheckbox: {
        styleOverrides: {
            root: {
                color: theme.palette.secondary.dark,
            },
        },
    },
});

const Chip = (theme: PopTheme) => ({
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                '&:active': {
                    boxShadow: 'none',
                },
            },
            sizeLarge: {
                fontSize: '1rem',
                height: 40,
            },
            light: {
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.lighter,
                borderColor: theme.palette.primary.light,
                '&.MuiChip-lightError': {
                    color: theme.palette.error.main,
                    backgroundColor: theme.palette.error.lighter,
                    borderColor: theme.palette.error.light,
                },
                '&.MuiChip-lightSuccess': {
                    color: theme.palette.success.main,
                    backgroundColor: theme.palette.success.lighter,
                    borderColor: theme.palette.success.light,
                },
                '&.MuiChip-lightWarning': {
                    color: theme.palette.warning.main,
                    backgroundColor: theme.palette.warning.lighter,
                    borderColor: theme.palette.warning.light,
                },
            },
        },
    },
});

const IconButton = (theme: PopTheme) => ({
    MuiIconButton: {
        styleOverrides: {
            root: {
                borderRadius: 4,
            },
            sizeLarge: {
                width: theme.spacing(5.5),
                height: theme.spacing(5.5),
                fontSize: '1.25rem',
            },
            sizeMedium: {
                width: theme.spacing(4.5),
                height: theme.spacing(4.5),
                fontSize: '1rem',
            },
            sizeSmall: {
                width: theme.spacing(3.75),
                height: theme.spacing(3.75),
                fontSize: '0.75rem',
            },
        },
    },
});

const InputLabel = (theme: PopTheme) => ({
    MuiInputLabel: {
        styleOverrides: {
            root: {
                color: theme.palette.grey[600],
            },
            outlined: {
                lineHeight: '0.8em',
                '&.MuiInputLabel-sizeSmall': {
                    lineHeight: '1em',
                },
                '&.MuiInputLabel-shrink': {
                    background: theme.palette.background.paper,
                    padding: '0 8px',
                    marginLeft: -6,
                    lineHeight: '1.4375em',
                },
            },
        },
    },
});

const LinearProgress = () => ({
    MuiLinearProgress: {
        styleOverrides: {
            root: {
                height: 6,
                borderRadius: 100,
            },
            bar: {
                borderRadius: 100,
            },
        },
    },
});

const Link = () => ({
    MuiLink: {
        defaultProps: {
            underline: 'hover',
        },
    },
});

const ListItemIcon = () => ({
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                minWidth: 24,
            },
        },
    },
});

const OutlinedInput = (theme: PopTheme) => ({
    MuiOutlinedInput: {
        styleOverrides: {
            input: {
                padding: '10.5px 14px 10.5px 12px',
            },
            notchedOutline: {
                borderColor: theme.palette.grey[300],
            },
            root: {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.light,
                },
                '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${alpha(
                        theme.palette.primary.main,
                        0.2
                    )}`,
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: `1px solid ${theme.palette.primary.light}`,
                    },
                },
                '&.Mui-error': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.error.light,
                    },
                    '&.Mui-focused': {
                        boxShadow: `0 0 0 2px ${alpha(
                            theme.palette.error.main,
                            0.2
                        )}`,
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: `1px solid ${theme.palette.error.light}`,
                        },
                    },
                },
            },
            inputSizeSmall: {
                padding: '7.5px 8px 7.5px 12px',
            },
            inputMultiline: {
                padding: 0,
            },
        },
    },
});

const Tab = (theme: PopTheme) => ({
    MuiTab: {
        styleOverrides: {
            root: {
                minHeight: 46,
                color: theme.palette.text.primary,
            },
        },
    },
});

const TableCell = (theme: PopTheme) => ({
    MuiTableCell: {
        styleOverrides: {
            root: {
                fontSize: '0.875rem',
                borderColor: theme.palette.divider,
            },
            head: {
                fontWeight: 600,
                paddingTop: 20,
                paddingBottom: 20,
            },
        },
    },
});

const Tabs = () => ({
    MuiTabs: {
        styleOverrides: {
            vertical: {
                overflow: 'visible',
            },
        },
    },
});

const Typography = () => ({
    MuiTypography: {
        styleOverrides: {
            gutterBottom: {
                marginBottom: 12,
            },
        },
    },
});

const RaLayout = () => {
    return {
        RaLayout: {
            styleOverrides: {
                root: {
                    marginTop: 20,
                },
            },
        },
    };
};

const componentsOverrides = (theme: PopTheme) =>
    Object.assign(
        Button(theme),
        Badge(theme),
        CardContent(),
        Checkbox(theme),
        Chip(theme),
        IconButton(theme),
        InputLabel(theme),
        LinearProgress(),
        Link(),
        ListItemIcon(),
        OutlinedInput(theme),
        Tab(theme),
        TableCell(theme),
        Tabs(),
        Typography(),
        RaLayout()
    );

const createPopTheme = (themeOptions: ThemeOptions): PopTheme => {
    const theme = createTheme(themeOptions) as PopTheme;
    theme.customShadows = customShadows(theme);
    theme.components = {
        ...defaultTheme.components,
        ...componentsOverrides(theme),
    };
    return theme;
};

export const popTheme = createPopTheme({
    breakpoints,
    mixins,
    palette,
    shape,
    typography,
});
