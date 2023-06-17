import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Typography, ThemeOptions } from '@mui/material';
import expect from 'expect';
import { memoryStore } from 'ra-core';

import { AdminContext } from './AdminContext';
import { ThemeTestWrapper } from './layout/ThemeTestWrapper';

const lightTheme: ThemeOptions = {};
const darkTheme: ThemeOptions = { palette: { mode: 'dark' } };

const LIGHT_MODE_TEXT_COLOR = 'rgb(25, 118, 210)'; // text is dark blue in light mode
const DARK_MODE_TEXT_COLOR = 'rgb(144, 202, 249)'; // text is light blue in dark mode

describe('AdminContext', () => {
    it('should default to light theme', () => {
        render(
            <AdminContext theme={lightTheme} darkTheme={darkTheme}>
                <Typography color="primary">Test</Typography>
            </AdminContext>
        );
        const text = screen.getByText('Test');
        expect(getComputedStyle(text).color).toBe(LIGHT_MODE_TEXT_COLOR);
    });
    it('should default to dark theme when the browser detects a dark mode preference', () => {
        render(
            <ThemeTestWrapper mode="dark">
                <AdminContext theme={lightTheme} darkTheme={darkTheme}>
                    <Typography color="primary">Test</Typography>
                </AdminContext>
            </ThemeTestWrapper>
        );
        const text = screen.getByText('Test');
        expect(getComputedStyle(text).color).toBe(DARK_MODE_TEXT_COLOR);
    });
    it('should default to light theme when the browser detects a dark mode preference', () => {
        render(
            <ThemeTestWrapper mode="light">
                <AdminContext theme={lightTheme} darkTheme={darkTheme}>
                    <Typography color="primary">Test</Typography>
                </AdminContext>
            </ThemeTestWrapper>
        );
        const text = screen.getByText('Test');
        expect(getComputedStyle(text).color).toBe(LIGHT_MODE_TEXT_COLOR);
    });
    it('should default to dark theme when user preference is dark', () => {
        render(
            <AdminContext
                theme={lightTheme}
                darkTheme={darkTheme}
                store={memoryStore({ theme: 'dark' })}
            >
                <Typography color="primary">Test</Typography>
            </AdminContext>
        );
        const text = screen.getByText('Test');
        expect(getComputedStyle(text).color).toBe(DARK_MODE_TEXT_COLOR);
    });
    it('should default to light theme when user preference is light', () => {
        render(
            <ThemeTestWrapper mode="dark">
                <AdminContext
                    theme={lightTheme}
                    darkTheme={darkTheme}
                    store={memoryStore({ theme: 'light' })}
                >
                    <Typography color="primary">Test</Typography>
                </AdminContext>
            </ThemeTestWrapper>
        );
        const text = screen.getByText('Test');
        expect(getComputedStyle(text).color).toBe(LIGHT_MODE_TEXT_COLOR);
    });
});
