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
};
const darkTheme: RaThemeOptions = {
    palette: {
        mode: 'dark',
        bulkActionsToolbarBackgroundColor: defaultTheme.palette.primary.dark,
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
