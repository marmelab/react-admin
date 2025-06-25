import { createTheme, Paper, Stack, ThemeOptions } from '@mui/material';
import * as React from 'react';
import { deepmerge } from '@mui/utils';

import { TextField, TextFieldProps } from './TextField';
import { AdminContext } from '../AdminContext';

export default { title: 'ra-ui-materialui/fields/TextField' };

export const Basic = ({
    value,
    theme,
    ...props
}: Partial<TextFieldProps> & { value?: string; theme?: 'light' | 'dark' }) => {
    return (
        <AdminContext defaultTheme={theme}>
            <Paper sx={{ p: 2 }}>
                <Stack direction="row">
                    <TextField record={{ value }} source="value" {...props} />
                </Stack>
            </Paper>
        </AdminContext>
    );
};

Basic.argTypes = {
    value: {
        options: ['filled', 'empty', 'undefined'],
        mapping: {
            filled: 'test',
            empty: '',
            undefined: undefined,
        },
        control: { type: 'select' },
    },
    theme: {
        options: ['light', 'dark'],
        control: { type: 'select' },
    },
};
Basic.args = {
    theme: 'light',
    value: 'filled',
};

export const Themed = () => {
    return (
        <AdminContext
            theme={deepmerge(createTheme(), {
                components: {
                    RaTextField: {
                        defaultProps: {
                            'data-testid': 'themed',
                        },
                        styleOverrides: {
                            root: {
                                color: 'hotpink',
                            },
                        },
                    },
                },
            } as ThemeOptions)}
        >
            <Paper sx={{ p: 2 }}>
                <Stack direction="row">
                    <TextField record={{ value: 'test' }} source="value" />
                </Stack>
            </Paper>
        </AdminContext>
    );
};
