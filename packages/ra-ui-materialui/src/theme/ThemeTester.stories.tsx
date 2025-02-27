import * as React from 'react';
import { useState } from 'react';
import { StoreContextProvider, memoryStore } from 'ra-core';
import {
    defaultLightTheme,
    defaultDarkTheme,
    nanoDarkTheme,
    nanoLightTheme,
    radiantDarkTheme,
    radiantLightTheme,
    houseDarkTheme,
    houseLightTheme,
    bwLightTheme,
    bwDarkTheme,
    RaThemeOptions,
    ThemeProvider,
    ThemesContext,
    useTheme,
} from './';
import {
    Box,
    ButtonGroup,
    Card,
    Stack,
    type StackProps,
    Typography,
} from '@mui/material';
import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from '@mui/material/styles';
import { Button } from '../button';

export default {
    title: 'ra-ui-materialui/theme/ThemeTester',
};

interface Theme {
    name: string;
    light: RaThemeOptions;
    dark?: RaThemeOptions;
}
const themes: Theme[] = [
    { name: 'Default', light: defaultLightTheme, dark: defaultDarkTheme },
    {
        name: 'B&W',
        light: bwLightTheme,
        dark: bwDarkTheme,
    },
    { name: 'Nano', light: nanoLightTheme, dark: nanoDarkTheme },
    { name: 'Radiant', light: radiantLightTheme, dark: radiantDarkTheme },
    { name: 'House', light: houseLightTheme, dark: houseDarkTheme },
];

const store = memoryStore();

export const ThemeTester = () => {
    const [themeName, setThemeName] = useState('Default');
    const lightTheme = themes.find(theme => theme.name === themeName)?.light;
    const darkTheme = themes.find(theme => theme.name === themeName)?.dark;
    return (
        <StoreContextProvider value={store}>
            <ThemesContext.Provider value={{ lightTheme, darkTheme }}>
                <ThemeProvider>
                    <ThemeSelector
                        themeName={themeName}
                        setThemeName={setThemeName}
                    />
                    <Card sx={{ m: 2, p: 2 }}>
                        <Section title="Buttons">
                            <Typography>Color</Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                <Button label="Default" />
                                <Button label="Primary" color="primary" />
                                <Button label="Secondary" color="secondary" />
                                <Button label="Error" color="error" />
                                <Button label="Warning" color="warning" />
                                <Button label="Success" color="success" />
                                <Button label="Disabled" disabled />
                            </Stack>
                            <Typography>Variant</Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                <Button label="Default" />
                                <Button label="Outlined" variant="outlined" />
                                <Button label="Contained" variant="contained" />
                                <Button label="Text" variant="text" />
                            </Stack>
                            <Typography>Size</Typography>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{ mb: 2, alignItems: 'flex-start' }}
                            >
                                <Button label="Small" size="small" />
                                <Button label="Medium" />
                                <Button label="Large" size="large" />
                            </Stack>
                        </Section>
                    </Card>
                </ThemeProvider>
            </ThemesContext.Provider>
        </StoreContextProvider>
    );
};

const ThemeSelector = ({ themeName, setThemeName }) => {
    const handleChange = (_: React.MouseEvent<HTMLElement>, index: number) => {
        const newTheme = themes[index];
        setThemeName(newTheme.name);
    };
    const [theme, setter] = useTheme();

    return (
        <MuiThemeProvider theme={createTheme()}>
            <Stack sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Theme</Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2}>
                            <ButtonGroup>
                                {themes.map((theme, index) => (
                                    <Button
                                        key={theme.name}
                                        label={theme.name}
                                        variant={
                                            theme.name === themeName
                                                ? 'contained'
                                                : 'outlined'
                                        }
                                        onClick={event =>
                                            handleChange(event, index)
                                        }
                                    />
                                ))}
                            </ButtonGroup>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Type</Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2}>
                            <ButtonGroup>
                                <Button
                                    label="Light"
                                    variant={
                                        theme === 'light'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    onClick={() => setter('light')}
                                />
                                <Button
                                    label="Dark"
                                    variant={
                                        theme === 'dark'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    onClick={() => setter('dark')}
                                />
                            </ButtonGroup>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </MuiThemeProvider>
    );
};

const Separator = () => (
    <Box
        sx={{
            marginX: -2,
            marginTop: 1,
            marginBottom: 1.5,
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
            '&:last-child': { borderBottom: 'none', margin: 0 },
        }}
    />
);

interface SectionProps extends Omit<StackProps, 'title'> {
    title: React.ReactNode;
    children: React.ReactNode;
}
export const Section = ({ title, children, ...rest }: SectionProps) => (
    <>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Typography sx={{ width: 200 }}>{title}</Typography>
            <Stack {...rest} sx={{ p: 0, maxWidth: 1000 }}>
                {children}
            </Stack>
        </Stack>
        <Separator />
    </>
);
