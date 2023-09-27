import { defaultTheme } from 'react-admin';
import {
    alpha,
    createTheme,
    Theme as MuiTheme,
    ThemeOptions,
} from '@mui/material/styles';
import { Shadows } from '@mui/material/styles/shadows';
import { TypographyOptions } from '@mui/material/styles/createTypography';

type CustomShadows = {
    z1: string;
    z4: string;
    z8: string;
    z12: string;
    z16: string;
    z20: string;
    z24: string;
    primary: string;
    info: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    card: string;
    dialog: string;
    dropdown: string;
};

interface MinimalTheme extends MuiTheme {
    customShadows: CustomShadows;
}

const GREY = {
    0: '#FFFFFF',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
};

const PRIMARY = {
    lighter: '#D1E9FC',
    light: '#76B0F1',
    main: '#2065D1',
    dark: '#103996',
    darker: '#061B64',
    contrastText: '#fff',
};

const SECONDARY = {
    lighter: '#D6E4FF',
    light: '#84A9FF',
    main: '#3366FF',
    dark: '#1939B7',
    darker: '#091A7A',
    contrastText: '#fff',
};

const INFO = {
    lighter: '#D0F2FF',
    light: '#74CAFF',
    main: '#1890FF',
    dark: '#0C53B7',
    darker: '#04297A',
    contrastText: '#fff',
};

const SUCCESS = {
    lighter: '#E9FCD4',
    light: '#AAF27F',
    main: '#54D62C',
    dark: '#229A16',
    darker: '#08660D',
    contrastText: GREY[800],
};

const WARNING = {
    lighter: '#FFF7CD',
    light: '#FFE16A',
    main: '#FFC107',
    dark: '#B78103',
    darker: '#7A4F01',
    contrastText: GREY[800],
};

const ERROR = {
    lighter: '#FFE7D9',
    light: '#FFA48D',
    main: '#FF4842',
    dark: '#B72136',
    darker: '#7A0C2E',
    contrastText: '#fff',
};

const pxToRem = (value: number) => {
    return `${value / 16}rem`;
};

const responsiveFontSizes = ({
    sm,
    md,
    lg,
}: {
    sm: number;
    md: number;
    lg: number;
}) => {
    return {
        '@media (min-width:600px)': {
            fontSize: pxToRem(sm),
        },
        '@media (min-width:900px)': {
            fontSize: pxToRem(md),
        },
        '@media (min-width:1200px)': {
            fontSize: pxToRem(lg),
        },
    };
};

// ----------------------------------------------------------------------

const FONT_PRIMARY = 'Public Sans, sans-serif';

const transparent = alpha(GREY[500], 0.16);
const transparent1 = alpha(GREY[500], 0.2);
const transparent2 = alpha(GREY[500], 0.14);
const transparent3 = alpha(GREY[500], 0.12);

const palette = {
    common: { black: '#000', white: '#fff' },
    primary: PRIMARY,
    secondary: SECONDARY,
    info: INFO,
    success: SUCCESS,
    warning: WARNING,
    error: ERROR,
    grey: GREY,
    divider: alpha(GREY[500], 0.24),
    text: {
        primary: GREY[800],
        secondary: GREY[600],
        disabled: GREY[500],
    },
    background: {
        paper: '#fff',
        default: GREY[100],
    },
    action: {
        active: GREY[600],
        hover: alpha(GREY[500], 0.08),
        selected: alpha(GREY[500], 0.16),
        disabled: alpha(GREY[500], 0.8),
        disabledBackground: alpha(GREY[500], 0.24),
        focus: alpha(GREY[500], 0.24),
        hoverOpacity: 0.08,
        disabledOpacity: 0.48,
    },
    mode: 'light' as 'light', // Switching the dark mode on is a single property value change.
};

const shape = { borderRadius: 6 };

const typography: TypographyOptions = {
    fontFamily: FONT_PRIMARY,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
        fontWeight: 800,
        lineHeight: 80 / 64,
        fontSize: pxToRem(40),
        ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
    },
    h2: {
        fontWeight: 800,
        lineHeight: 64 / 48,
        fontSize: pxToRem(32),
        ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
    },
    h3: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(24),
        ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
    },
    h4: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(20),
        ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
    },
    h5: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(18),
        ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
    },
    h6: {
        fontWeight: 700,
        lineHeight: 28 / 18,
        fontSize: pxToRem(17),
        ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
    },
    subtitle1: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: pxToRem(16),
    },
    subtitle2: {
        fontWeight: 600,
        lineHeight: 22 / 14,
        fontSize: pxToRem(14),
    },
    body1: {
        lineHeight: 1.5,
        fontSize: pxToRem(16),
    },
    body2: {
        lineHeight: 22 / 14,
        fontSize: pxToRem(14),
    },
    caption: {
        lineHeight: 1.5,
        fontSize: pxToRem(12),
    },
    overline: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(12),
        textTransform: 'uppercase',
    },
    button: {
        fontWeight: 700,
        lineHeight: 24 / 14,
        fontSize: pxToRem(14),
        textTransform: 'capitalize',
    },
};

const shadows: Shadows = [
    'none',
    `0px 2px 1px -1px ${transparent1},0px 1px 1px 0px ${transparent2},0px 1px 3px 0px ${transparent3}`,
    `0px 3px 1px -2px ${transparent1},0px 2px 2px 0px ${transparent2},0px 1px 5px 0px ${transparent3}`,
    `0px 3px 3px -2px ${transparent1},0px 3px 4px 0px ${transparent2},0px 1px 8px 0px ${transparent3}`,
    `0px 2px 4px -1px ${transparent1},0px 4px 5px 0px ${transparent2},0px 1px 10px 0px ${transparent3}`,
    `0px 3px 5px -1px ${transparent1},0px 5px 8px 0px ${transparent2},0px 1px 14px 0px ${transparent3}`,
    `0px 3px 5px -1px ${transparent1},0px 6px 10px 0px ${transparent2},0px 1px 18px 0px ${transparent3}`,
    `0px 4px 5px -2px ${transparent1},0px 7px 10px 1px ${transparent2},0px 2px 16px 1px ${transparent3}`,
    `0px 5px 5px -3px ${transparent1},0px 8px 10px 1px ${transparent2},0px 3px 14px 2px ${transparent3}`,
    `0px 5px 6px -3px ${transparent1},0px 9px 12px 1px ${transparent2},0px 3px 16px 2px ${transparent3}`,
    `0px 6px 6px -3px ${transparent1},0px 10px 14px 1px ${transparent2},0px 4px 18px 3px ${transparent3}`,
    `0px 6px 7px -4px ${transparent1},0px 11px 15px 1px ${transparent2},0px 4px 20px 3px ${transparent3}`,
    `0px 7px 8px -4px ${transparent1},0px 12px 17px 2px ${transparent2},0px 5px 22px 4px ${transparent3}`,
    `0px 7px 8px -4px ${transparent1},0px 13px 19px 2px ${transparent2},0px 5px 24px 4px ${transparent3}`,
    `0px 7px 9px -4px ${transparent1},0px 14px 21px 2px ${transparent2},0px 5px 26px 4px ${transparent3}`,
    `0px 8px 9px -5px ${transparent1},0px 15px 22px 2px ${transparent2},0px 6px 28px 5px ${transparent3}`,
    `0px 8px 10px -5px ${transparent1},0px 16px 24px 2px ${transparent2},0px 6px 30px 5px ${transparent3}`,
    `0px 8px 11px -5px ${transparent1},0px 17px 26px 2px ${transparent2},0px 6px 32px 5px ${transparent3}`,
    `0px 9px 11px -5px ${transparent1},0px 18px 28px 2px ${transparent2},0px 7px 34px 6px ${transparent3}`,
    `0px 9px 12px -6px ${transparent1},0px 19px 29px 2px ${transparent2},0px 7px 36px 6px ${transparent3}`,
    `0px 10px 13px -6px ${transparent1},0px 20px 31px 3px ${transparent2},0px 8px 38px 7px ${transparent3}`,
    `0px 10px 13px -6px ${transparent1},0px 21px 33px 3px ${transparent2},0px 8px 40px 7px ${transparent3}`,
    `0px 10px 14px -6px ${transparent1},0px 22px 35px 3px ${transparent2},0px 8px 42px 7px ${transparent3}`,
    `0px 11px 14px -7px ${transparent1},0px 23px 36px 3px ${transparent2},0px 9px 44px 8px ${transparent3}`,
    `0px 11px 15px -7px ${transparent1},0px 24px 38px 3px ${transparent2},0px 9px 46px 8px ${transparent3}`,
];

const customShadows: CustomShadows = {
    z1: `0 1px 2px 0 ${transparent}`,
    z4: `0 4px 8px 0 ${transparent}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z12: `0 12px 24px -4px ${transparent}`,
    z16: `0 16px 32px -4px ${transparent}`,
    z20: `0 20px 40px -4px ${transparent}`,
    z24: `0 24px 48px 0 ${transparent}`,
    //
    primary: `0 8px 16px 0 ${alpha(PRIMARY.main, 0.24)}`,
    info: `0 8px 16px 0 ${alpha(INFO.main, 0.24)}`,
    secondary: `0 8px 16px 0 ${alpha(SECONDARY.main, 0.24)}`,
    success: `0 8px 16px 0 ${alpha(SUCCESS.main, 0.24)}`,
    warning: `0 8px 16px 0 ${alpha(WARNING.main, 0.24)}`,
    error: `0 8px 16px 0 ${alpha(ERROR.main, 0.24)}`,
    //
    card: `0 0 2px 0 ${alpha(GREY[500], 0.2)}, 0 12px 24px -4px ${alpha(
        GREY[500],
        0.12
    )}`,
    dialog: `-40px 40px 80px -8px ${alpha(GREY[500], 0.24)}`,
    dropdown: `0 0 2px 0 ${alpha(
        GREY[500],
        0.24
    )}, -20px 20px 40px -4px ${alpha(GREY[500], 0.24)}`,
};

const Autocomplete = (theme: MinimalTheme) => {
    return {
        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    boxShadow: theme.customShadows.z20,
                },
            },
        },
    };
};

const Backdrop = (theme: MinimalTheme) => {
    return {
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(theme.palette.grey[800], 0.8),
                },
                invisible: {
                    background: 'transparent',
                },
            },
        },
    };
};

const Button = (theme: MinimalTheme) => {
    return {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                sizeLarge: {
                    height: 48,
                },
                containedInherit: {
                    color: theme.palette.grey[800],
                    boxShadow: theme.customShadows.z8,
                    '&:hover': {
                        backgroundColor: theme.palette.grey[400],
                    },
                },
                containedPrimary: {
                    boxShadow: theme.customShadows.primary,
                },
                containedSecondary: {
                    boxShadow: theme.customShadows.secondary,
                },
                outlinedInherit: {
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.32)}`,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                },
                textInherit: {
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                },
            },
        },
    };
};

const Card = (theme: MinimalTheme) => {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: theme.customShadows.card,
                    borderRadius: Number(theme.shape.borderRadius) * 2,
                    position: 'relative',
                    zIndex: 0, // Fix Safari overflow: hidden with border radius
                },
            },
        },
        MuiCardHeader: {
            defaultProps: {
                titleTypographyProps: { variant: 'h6' },
                subheaderTypographyProps: { variant: 'body2' },
            },
            styleOverrides: {
                root: {
                    padding: theme.spacing(3, 3, 0),
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: theme.spacing(3),
                },
            },
        },
    };
};

const Input = (theme: MinimalTheme) => {
    return {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        '& svg': { color: theme.palette.text.disabled },
                    },
                },
                input: {
                    '&::placeholder': {
                        opacity: 1,
                        color: theme.palette.text.disabled,
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                underline: {
                    '&:before': {
                        borderBottomColor: alpha(theme.palette.grey[500], 0.56),
                    },
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(theme.palette.grey[500], 0.12),
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.grey[500], 0.16),
                    },
                    '&.Mui-focused': {
                        backgroundColor: theme.palette.action.focus,
                    },
                    '&.Mui-disabled': {
                        backgroundColor:
                            theme.palette.action.disabledBackground,
                    },
                },
                underline: {
                    '&:before': {
                        borderBottomColor: alpha(theme.palette.grey[500], 0.56),
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.grey[500], 0.32),
                    },
                    '&.Mui-disabled': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor:
                                theme.palette.action.disabledBackground,
                        },
                    },
                },
            },
        },
    };
};

const Paper = () => {
    return {
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    };
};

const Table = (theme: MinimalTheme) => {
    return {
        MuiTableCell: {
            styleOverrides: {
                root: { padding: 16 },
                head: {
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.background.default,
                },
            },
        },
    };
};

const Tooltip = (theme: MinimalTheme) => {
    return {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: theme.palette.grey[800],
                },
                arrow: {
                    color: theme.palette.grey[800],
                },
            },
        },
    };
};

const Typography = (theme: MinimalTheme) => {
    return {
        MuiTypography: {
            styleOverrides: {
                paragraph: {
                    marginBottom: theme.spacing(2),
                },
                gutterBottom: {
                    marginBottom: theme.spacing(1),
                },
            },
        },
    };
};

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

const componentsOverrides = (theme: MinimalTheme) =>
    Object.assign(
        Card(theme),
        Table(theme),
        Input(theme),
        Paper(),
        Button(theme),
        Tooltip(theme),
        Backdrop(theme),
        Typography(theme),
        Autocomplete(theme),
        RaLayout()
    );

const createMinimalTheme = (themeOptions: ThemeOptions): MinimalTheme => {
    const theme = createTheme(themeOptions) as MinimalTheme;
    theme.customShadows = customShadows;
    theme.components = {
        ...defaultTheme.components,
        ...componentsOverrides(theme),
    };
    return theme;
};

export const minimalTheme = createMinimalTheme({
    palette,
    shape,
    typography,
    shadows,
});
