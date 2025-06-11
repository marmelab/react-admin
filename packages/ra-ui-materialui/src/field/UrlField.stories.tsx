import { createTheme, Paper, Stack, ThemeOptions } from '@mui/material';
import * as React from 'react';
import { deepmerge } from '@mui/utils';

import { UrlField, UrlFieldProps } from './UrlField';
import { AdminContext } from '../AdminContext';

export default { title: 'ra-ui-materialui/fields/UrlField' };

export const Basic = ({
    value,
    theme,
    ...props
}: Partial<UrlFieldProps> & { value?: string; theme?: 'light' | 'dark' }) => {
    return (
        <AdminContext defaultTheme={theme}>
            <Paper sx={{ p: 2 }}>
                <Stack direction="row">
                    <UrlField record={{ value }} source="value" {...props} />
                </Stack>
            </Paper>
        </AdminContext>
    );
};

Basic.argTypes = {
    value: {
        options: ['filled', 'empty', 'undefined'],
        mapping: {
            filled: 'https://example.org',
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
                    RaUrlField: {
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
                    <UrlField
                        record={{ value: 'https://example.org' }}
                        source="value"
                    />
                </Stack>
            </Paper>
        </AdminContext>
    );
};
