import { grey } from '@mui/material/colors';
import { RaThemeOptions } from 'react-admin';

/** Just for fun */

export const chiptuneTheme: RaThemeOptions = {
    palette: {
        mode: 'dark' as 'dark',
        primary: {
            main: '#0f0',
        },
        background: {
            default: '#111111',
            paper: '#212121',
        },
    },
    typography: {
        fontFamily: `'Pixelify Sans', cursive`,
    },
    components: {
        MuiAutocomplete: { defaultProps: { fullWidth: true } },
        MuiFormControl: { defaultProps: { fullWidth: true } },
        MuiTextField: { defaultProps: { fullWidth: true } },
        RaSimpleFormIterator: { defaultProps: { fullWidth: true } },
        RaToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: grey[900],
                },
            },
        },
    },
};
