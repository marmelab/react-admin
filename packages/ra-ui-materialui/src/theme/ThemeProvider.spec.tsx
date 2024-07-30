import * as React from 'react';
import { render, screen } from '@testing-library/react';
import expect from 'expect';
import { StoreContextProvider, memoryStore } from 'ra-core';
import { Button, ThemeOptions } from '@mui/material';

import { ThemeProvider } from './ThemeProvider';
import { ThemesContext } from './ThemesContext';
import { ThemeTestWrapper } from '../layout/ThemeTestWrapper';

const lightTheme: ThemeOptions = {};
const darkTheme: ThemeOptions = { palette: { mode: 'dark' } };

const LIGHT_MODE_TEXT_COLOR = 'rgb(25, 118, 210)'; // text is dark blue in light mode
const DARK_MODE_TEXT_COLOR = 'rgb(144, 202, 249)'; // text is light blue in dark mode

describe('ThemeProvider', () => {
    it('should create a material-ui theme context based on the ThemesContext and theme preference light', () => {
        render(
            <StoreContextProvider value={memoryStore({ theme: 'light' })}>
                <ThemesContext.Provider value={{ lightTheme, darkTheme }}>
                    <ThemeProvider>
                        <Button>Test</Button>
                    </ThemeProvider>
                </ThemesContext.Provider>
            </StoreContextProvider>
        );
        const button = screen.getByText('Test');
        expect(getComputedStyle(button).color).toBe(LIGHT_MODE_TEXT_COLOR);
    });

    it('should create a material-ui theme context based on the ThemesContext and theme preference dark', () => {
        render(
            <StoreContextProvider value={memoryStore({ theme: 'dark' })}>
                <ThemesContext.Provider value={{ lightTheme, darkTheme }}>
                    <ThemeProvider>
                        <Button>Test</Button>
                    </ThemeProvider>
                </ThemesContext.Provider>
            </StoreContextProvider>
        );
        const button = screen.getByText('Test');
        expect(getComputedStyle(button).color).toBe(DARK_MODE_TEXT_COLOR);
    });

    it('should default to a light theme when no theme preference is set', () => {
        render(
            <ThemesContext.Provider value={{ lightTheme, darkTheme }}>
                <ThemeProvider>
                    <Button>Test</Button>
                </ThemeProvider>
            </ThemesContext.Provider>
        );
        const button = screen.getByText('Test');
        expect(getComputedStyle(button).color).toBe(LIGHT_MODE_TEXT_COLOR);
    });

    it('should default to light theme when the browser detects a light mode preference', () => {
        render(
            <ThemeTestWrapper mode="light">
                <ThemesContext.Provider value={{ lightTheme, darkTheme }}>
                    <ThemeProvider>
                        <Button>Test</Button>
                    </ThemeProvider>
                </ThemesContext.Provider>
            </ThemeTestWrapper>
        );
        const button = screen.getByText('Test');
        expect(getComputedStyle(button).color).toBe(LIGHT_MODE_TEXT_COLOR);
    });

    it('should default to dark theme when the browser detects a dark mode preference', () => {
        render(
            <ThemeTestWrapper mode="dark">
                <ThemesContext.Provider value={{ lightTheme, darkTheme }}>
                    <ThemeProvider>
                        <Button>Test</Button>
                    </ThemeProvider>
                </ThemesContext.Provider>
            </ThemeTestWrapper>
        );
        const button = screen.getByText('Test');
        expect(getComputedStyle(button).color).toBe(DARK_MODE_TEXT_COLOR);
    });
});
