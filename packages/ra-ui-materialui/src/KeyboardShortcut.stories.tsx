import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { KeyboardShortcut } from './KeyboardShortcut';
import { defaultTheme } from './theme';

export default {
    title: 'ra-ui-materialui/KeyboardShortcut',
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={createTheme(defaultTheme)}>{children}</ThemeProvider>
);

export const Default = () => (
    <Wrapper>
        <KeyboardShortcut keyboardShortcut="meta+K" />
    </Wrapper>
);

export const Sequential = () => (
    <Wrapper>
        <KeyboardShortcut keyboardShortcut="meta+K>X" />
    </Wrapper>
);

export const SameKeyTwice = () => (
    <Wrapper>
        <KeyboardShortcut keyboardShortcut="g>g" />
    </Wrapper>
);
