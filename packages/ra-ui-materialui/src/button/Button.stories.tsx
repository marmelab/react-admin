import * as React from 'react';
import { createTheme, ThemeProvider, Stack } from '@mui/material';
import type { PaletteColor } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Button } from './Button';
import { ReactNode } from 'react';

export default { title: 'ra-ui-materialui/button/Button' };

export const Basic = () => (
    <ThemeProvider theme={theme}>
        <UIWrapper>
            <Button label="button" />
            <Button label="button" variant="outlined" />
            <Button label="button" variant="contained" />
        </UIWrapper>
    </ThemeProvider>
);

export const WithIcon = () => (
    <ThemeProvider theme={theme}>
        <UIWrapper>
            <Button label="button">
                <AddIcon />
            </Button>
            <Button label="button" variant="outlined">
                <AddIcon />
            </Button>
            <Button label="button" variant="contained">
                <AddIcon />
            </Button>
        </UIWrapper>
    </ThemeProvider>
);

export const WithUserDefinedPalette = () => (
    <ThemeProvider theme={theme}>
        <UIWrapper>
            <Button label="button" color="userDefined">
                <AddIcon />
            </Button>
            <Button label="button" color="userDefined" variant="outlined">
                <AddIcon />
            </Button>
            <Button label="button" color="userDefined" variant="contained">
                <AddIcon />
            </Button>
        </UIWrapper>
    </ThemeProvider>
);

const UIWrapper = ({ children }: { children: ReactNode }) => (
    <Stack sx={{ alignItems: 'flex-start', gap: 1, margin: 1 }}>
        {children}
    </Stack>
);

const theme = createTheme({
    palette: {
        userDefined: {
            light: '#18DBAD',
            main: '#07CC9D',
            dark: '#07BA8F',
            contrastText: '#ffffff',
        },
    },
});

declare module '@mui/material/styles' {
    interface Palette {
        userDefined: PaletteColor;
    }
    interface PaletteOptions {
        userDefined: PaletteColor;
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        userDefined: true;
    }
}
