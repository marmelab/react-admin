import * as React from 'react';
import {
    createTheme,
    List,
    ListItem,
    ListItemText,
    Paper,
    ThemeProvider,
} from '@mui/material';
import { KeyboardShortcut } from './KeyboardShortcut';
import { defaultTheme } from './theme';

export default {
    title: 'ra-ui-materialui/KeyboardShortcut',
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={createTheme(defaultTheme)}>
        <Paper sx={{ maxWidth: '60%', mx: 'auto', p: 2, mt: 2 }}>
            {children}
        </Paper>
    </ThemeProvider>
);

export const Default = () => (
    <Wrapper>
        <List>
            <ListItem
                secondaryAction={<KeyboardShortcut keyboardShortcut="meta+K" />}
            >
                <ListItemText primary="meta and k" />
            </ListItem>
            <ListItem
                secondaryAction={
                    <KeyboardShortcut keyboardShortcut="shift+a" />
                }
            >
                <ListItemText primary="shift and a" />
            </ListItem>
            <ListItem
                secondaryAction={<KeyboardShortcut keyboardShortcut="mod+B" />}
            >
                <ListItemText primary="mod and b" />
            </ListItem>
            <ListItem
                secondaryAction={<KeyboardShortcut keyboardShortcut="alt+F" />}
            >
                <ListItemText primary="alt and f" />
            </ListItem>
            <ListItem
                secondaryAction={
                    <KeyboardShortcut keyboardShortcut="escape+F" />
                }
            >
                <ListItemText primary="escape and f" />
            </ListItem>
            <ListItem
                secondaryAction={<KeyboardShortcut keyboardShortcut="esc+F" />}
            >
                <ListItemText primary="escape (written esc) and f" />
            </ListItem>
            <ListItem
                secondaryAction={
                    <KeyboardShortcut keyboardShortcut="shift+up" />
                }
            >
                <ListItemText primary="shift and up" />
            </ListItem>
            <ListItem
                secondaryAction={<KeyboardShortcut keyboardShortcut="ctrl+d" />}
            >
                <ListItemText primary="ctrl and d" />
            </ListItem>
            <ListItem
                secondaryAction={
                    <KeyboardShortcut keyboardShortcut="meta+K>X" />
                }
            >
                <ListItemText primary="Meta and k then x" />
            </ListItem>
            <ListItem
                secondaryAction={
                    <KeyboardShortcut keyboardShortcut="space>a" />
                }
            >
                <ListItemText primary="Space then a" />
            </ListItem>
            <ListItem
                secondaryAction={<KeyboardShortcut keyboardShortcut="g>g" />}
            >
                <ListItemText primary="g then g" />
            </ListItem>
            <ListItem
                secondaryAction={
                    <KeyboardShortcut keyboardShortcut="ctrl+shift+a+c" />
                }
            >
                <ListItemText primary="ctrl and shift and a and c" />
            </ListItem>
        </List>
    </Wrapper>
);
