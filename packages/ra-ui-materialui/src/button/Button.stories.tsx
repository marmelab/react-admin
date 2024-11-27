import * as React from 'react';
import { ReactNode } from 'react';
import { createTheme, ThemeProvider, Stack, Tooltip } from '@mui/material';
import type { PaletteColor } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { Button } from './Button';
import { defaultTheme } from '../theme/defaultTheme';

export default { title: 'ra-ui-materialui/button/Button' };

export const Basic = () => (
    <ThemeProvider theme={createTheme(defaultTheme)}>
        <UIWrapper>
            <Button label="default" />
            <Button label="outlined" variant="outlined" />
            <Button label="contained" variant="contained" />
            <Button label="error contained" color="error" variant="contained" />
            <Button
                label="secondary contained"
                color="secondary"
                variant="contained"
            />
        </UIWrapper>
    </ThemeProvider>
);

export const WithIcon = () => (
    <ThemeProvider theme={createTheme(defaultTheme)}>
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

export const WithThemeProps = () => (
    <ThemeProvider
        theme={createTheme({
            ...defaultTheme,
            components: {
                // @ts-ignore
                RaButton: {
                    defaultProps: {
                        size: 'normal',
                        color: 'secondary',
                    },
                },
            },
        })}
    >
        <UIWrapper>
            <Button label="button" />
            <Button label="button" variant="outlined" />
            <Button label="button" variant="contained" />
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

export const WithTooltip = () => (
    <ThemeProvider theme={theme}>
        <Tooltip title="This is a button">
            <Button label="button" />
        </Tooltip>
    </ThemeProvider>
);

const UIWrapper = ({ children }: { children: ReactNode }) => (
    <Stack
        sx={{
            gap: 1,
            alignItems: 'flex-start',
            margin: 2,
            padding: 2,
        }}
    >
        {children}
    </Stack>
);

/**
 * Adding new theme tokens to the palette
 * @see https://mui.com/material-ui/experimental-api/css-theme-variables/customization/#typescript
 */
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
        userDefined?: PaletteColor;
    }
    interface PaletteOptions {
        userDefined?: PaletteColor;
    }
}

/**
 * Adding new theme tokens to the Button
 * https://mui.com/material-ui/customization/theme-components/#creating-new-component-variants
 */
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        userDefined: true;
    }
}
