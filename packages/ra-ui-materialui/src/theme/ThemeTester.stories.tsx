import * as React from 'react';
import { useState } from 'react';
import { useStore, StoreContextProvider, memoryStore } from 'ra-core';
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
    ThemeProvider,
    ThemesContext,
} from './';
import { Box, Card, Stack, Typography } from '@mui/material';
import { Button } from '../button';

export default {
    title: 'ra-ui-materialui/theme/ThemeTester',
};

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

export const ThemeTester = () => {
    const [themeName, setThemeName] = useState('themeName', 'default');
    const [themeType, setThemeType] = useState('themeType', 'light');
    const lightTheme = themes.find(theme => theme.name === themeName)?.light;
    const darkTheme = themes.find(theme => theme.name === themeName)?.dark;
    return (
        <StoreContextProvider value={memoryStore()}>
            <ThemesContext.Provider
                value={{
                    lightTheme,
                    darkTheme,
                }}
            >
                <ThemeProvider>
                    <ThemeSelector
                        themeName={themeName}
                        setThemeName={setThemeName}
                    />
                    <Card sx={{ m: 2, p: 2 }}>
                        <Section title="Buttons">
                            <Button label="Default" />
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
    const [theme, setter] = useStore('theme', 'light');

    return (
        <Stack sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Typography sx={{ width: 200 }}>Theme</Typography>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                        {themes.map((theme, index) => (
                            <Button
                                key={theme.name}
                                label={theme.name}
                                variant={
                                    theme.name === themeName
                                        ? 'outlined'
                                        : 'text'
                                }
                                onClick={event => handleChange(event, index)}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Typography sx={{ width: 200 }}>Type</Typography>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            label="Light"
                            variant={theme === 'light' ? 'outlined' : 'text'}
                            onClick={() => setter('light')}
                        />
                        <Button
                            label="Dark"
                            variant={theme === 'dark' ? 'outlined' : 'text'}
                            onClick={() => setter('dark')}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
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
