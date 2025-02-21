import {
    amber,
    common,
    green,
    grey,
    lightBlue,
    red,
} from '@mui/material/colors';
import { RaThemeOptions } from './types';

const background = common['black'];
const bodyBackground = common['black'];

const createBWTheme = (mode: 'light' | 'dark'): RaThemeOptions => {
    const isDarkMode = mode === 'dark';
    const SPACING = 8;
    const GREY = isDarkMode ? grey[800] : grey[300];
    return {
        palette: {
            mode,
            primary: {
                dark: isDarkMode ? grey['200'] : common['black'],
                main: isDarkMode ? common['white'] : grey['900'],
                light: isDarkMode ? grey['800'] : grey['100'],
            },
            secondary: {
                main: isDarkMode ? grey['100'] : grey['800'],
            },
            success: {
                main: green['900'],
            },
            error: {
                main: red['900'],
            },
            info: {
                main: lightBlue['900'],
            },
            warning: {
                main: amber['900'],
            },
            divider: GREY,
            background: {
                default: isDarkMode ? background : grey[50],
                paper: isDarkMode ? background : grey[50],
            },
        },
        shape: {
            borderRadius: 4,
        },
        spacing: SPACING,
        typography: {
            fontSize: 14,
            htmlFontSize: 18,
            fontFamily: [
                'Geist',
                '"Source Sans Pro"',
                '-apple-system',
                'BlinkMacSystemFont',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
                '"Noto Color Emoji"',
            ].join(','),
            fontWeightMedium: 700,
            fontWeightBold: 800,
            h1: {
                fontSize: '3.75rem',
                fontWeight: 600,
            },
            h2: {
                fontSize: '3rem',
                fontWeight: 600,
            },
            h3: {
                fontSize: '2.125rem',
                fontWeight: 600,
            },
            h4: {
                fontSize: '1.5rem',
                fontWeight: 600,
            },
            h5: {
                fontSize: '1.25rem',
                fontWeight: 600,
            },
            h6: {
                fontSize: '1rem',
                fontWeight: 600,
            },
            overline: {
                textTransform: 'capitalize',
                fontSize: '0.75rem',
                fontWeight: 600,
            },
        },
        shadows: [
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
            'none',
        ],
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    ':root': {
                        colorScheme: isDarkMode ? 'dark' : 'light',
                    },
                    html: {
                        minHeight: '100%',
                    },
                    body: {
                        minHeight: '100%',
                        backgroundColor: isDarkMode
                            ? bodyBackground
                            : '#fbfbfb',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'top right',
                        backgroundSize: '100%',
                    },
                },
            },
            MuiIconButton: {
                defaultProps: { disableRipple: true },
            },
            MuiListItemButton: {
                defaultProps: { disableRipple: true },
            },
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        backgroundColor: isDarkMode
                            ? common['black']
                            : common['white'],
                    },
                },
            },
            MuiButtonBase: {
                defaultProps: { disableRipple: true },
            },
            MuiButton: {
                defaultProps: {
                    variant: 'outlined' as const,
                    disableRipple: true,
                },
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&.MuiButton-outlined': {
                            '--variant-outlinedBorder': GREY,
                            '&:hover': {
                                backgroundColor: GREY,
                                '--variant-outlinedBorder': GREY,
                            },
                        },
                    },
                    sizeSmall: {
                        padding: '4px 12px',
                        fontSize: '0.8rem',
                    },
                    sizeMedium: {
                        padding: '6px 18px',
                    },
                    sizeLarge: {
                        padding: '10px 24px',
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none',
                        border: 0,
                        borderBottom: `1px solid ${GREY}`,
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: isDarkMode
                            ? background
                            : common['white'],
                        border: `1px solid ${GREY}`,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        backgroundColor: isDarkMode
                            ? '#090909'
                            : common['white'],
                        border: `1px solid ${GREY}`,
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
            MuiTextField: {
                defaultProps: {
                    variant: 'outlined' as const,
                    fullWidth: true,
                    size: 'small' as const,
                    margin: 'dense' as const,
                },
            },
            MuiTabs: {
                styleOverrides: {
                    root: {
                        height: 38,
                        minHeight: 38,
                        overflow: 'visible',
                    },
                    scrollableX: {
                        overflow: 'visible !important',
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
                        textTransform: 'capitalize',
                        '&.MuiButtonBase-root': {
                            minWidth: 'auto',
                            paddingLeft: 20,
                            paddingRight: 20,
                            marginRight: 4,
                        },
                        '&:hover': {
                            color: isDarkMode ? common['white'] : grey['900'],
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
                        padding: `${SPACING * 2}px`,
                        borderBottom: `1px solid ${isDarkMode ? grey[900] : grey[300]}`,
                        '&.MuiTableCell-sizeSmall': {
                            padding: `${SPACING * 0.75}px ${SPACING * 1.25}px`,
                        },
                        '&.MuiTableCell-paddingNone': {
                            padding: `${SPACING * 0.5}px`,
                        },
                    },
                },
            },
            MuiTableSortLabel: {
                styleOverrides: {
                    root: {
                        color: isDarkMode ? grey['500'] : grey['600'],
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 4,
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
            RaBulkActionsToolbar: {
                styleOverrides: {
                    root: {
                        '& .RaBulkActionsToolbar-toolbar': {
                            backgroundColor: isDarkMode ? background : grey[50],
                            border: `1px solid ${GREY}`,
                            '&.RaBulkActionsToolbar-collapsed': {
                                border: 'transparent',
                            },
                        },
                    },
                },
            },
            RaMenuItemLink: {
                styleOverrides: {
                    root: {
                        margin: `0 ${SPACING}px`,
                        paddingRight: 0,
                        borderRadius: 5,
                        color: isDarkMode ? grey['200'] : common['black'],
                        '&.RaMenuItemLink-active': {
                            backgroundColor: GREY,
                        },
                        '& .RaMenuItemLink-icon': {
                            minWidth: 30,
                        },
                    },
                },
            },
        },
        sidebar: {
            width: 195,
            closedWidth: 50,
        },
    };
};

export const bwLightTheme = createBWTheme('light');
export const bwDarkTheme = createBWTheme('dark');
