import { outlinedInputClasses } from '@mui/material';
import { defaultTheme } from 'react-admin';

export const synthwaveTheme = {
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
    palette: {
        primary: {
            main: '#e7e3fcdd',
        },
        secondary: {
            main: '#9155fd',
            contrastText: '#e7e3fcde',
        },
        background: {
            default: '#28243d',
        },
        error: {
            main: '#ff4c51',
        },
        warning: {
            main: '#ffb400',
        },
        info: {
            main: '#16b1ff',
        },
        success: {
            main: '#56ca00',
        },
        mode: 'dark' as 'dark',
    },
    shape: {
        borderRadius: 6,
    },
    sidebar: {
        width: 250,
    },
    components: {
        ...defaultTheme.components,
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: 'Inter, sans-serif',
                },
            },
        },
        RaLayout: {
            styleOverrides: {
                root: {
                    marginTop: 20,
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#28243d',
                },
            },
        },
        RaMenuItemLink: {
            styleOverrides: {
                root: {
                    borderLeft: '3px solid #fff',
                    '&:hover': {
                        borderRadius: '0px 100px 100px 0px',
                    },
                    '&.RaMenuItemLink-active': {
                        borderLeft: '3px solid #4f3cc9',
                        borderRadius: '0px 100px 100px 0px',
                        backgroundImage:
                            'linear-gradient(98deg, #c6a7fe, #9155fd 94%)',
                        boxShadow: '#1311206b 0px 4px 8px -4px',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: '#1311201a 0px 2px 10px 0px',
                },
                root: {
                    backgroundClip: 'padding-box',
                    backgroundColor: '#312d4b',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                colorSecondary: {
                    color: '#808080',
                    backgroundColor: '#fff',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: '#f5f5f5',
                },
                barColorPrimary: {
                    backgroundColor: '#d7d7d7',
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
            },
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'outlined' as const,
                margin: 'dense' as const,
                padding: 20,
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: '#9155fd',
                    },
                },
            },
        },
    },
};
