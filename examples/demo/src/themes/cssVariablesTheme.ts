import { createTheme, lighten } from '@mui/material';
import { RaThemeOptions } from 'react-admin';

const defaultTheme = createTheme();
const lightTheme: RaThemeOptions = {
    palette: {
        mode: 'light',
        bulkActionsToolbarBackgroundColor: lighten(
            defaultTheme.palette.primary.light,
            0.8
        ),
    },
    components: {
        RaToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: `color-mix(in oklab, var(--mui-palette-background-paper) 80%, light-dark(black, white))`,
                },
            },
        },
    },
};
const darkTheme: RaThemeOptions = {
    palette: {
        mode: 'dark',
        bulkActionsToolbarBackgroundColor: defaultTheme.palette.primary.dark,
    },
    components: {
        RaToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: `color-mix(in oklab, var(--mui-palette-background-paper) 80%, light-dark(black, white))`,
                },
            },
        },
    },
};

export const cssVariablesTheme = createTheme({
    cssVariables: true,
    defaultColorScheme: 'light',
    colorSchemes: {
        light: lightTheme,
        dark: darkTheme,
    },
});
