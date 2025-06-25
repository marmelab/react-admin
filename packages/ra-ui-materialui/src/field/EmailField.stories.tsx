import { createTheme, Paper, Stack, ThemeOptions } from '@mui/material';
import * as React from 'react';
import { deepmerge } from '@mui/utils';

import { EmailField, EmailFieldProps } from './EmailField';
import { AdminContext } from '../AdminContext';
import { defaultDarkTheme, defaultLightTheme } from '../theme';

export default { title: 'ra-ui-materialui/fields/EmailField' };

export const Basic = ({
    value,
    theme,
    ...props
}: Partial<EmailFieldProps> & { value?: string; theme?: string }) => {
    return (
        <AdminContext
            theme={theme === 'light' ? defaultLightTheme : defaultDarkTheme}
        >
            <Paper sx={{ p: 2 }}>
                <Stack direction="row">
                    <EmailField record={{ value }} source="value" {...props} />
                </Stack>
            </Paper>
        </AdminContext>
    );
};

Basic.argTypes = {
    value: {
        options: ['filled', 'empty', 'undefined'],
        mapping: {
            filled: 'test@test.test',
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
                    RaEmailField: {
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
                    <EmailField
                        record={{ value: 'test@test.test' }}
                        source="value"
                    />
                </Stack>
            </Paper>
        </AdminContext>
    );
};
