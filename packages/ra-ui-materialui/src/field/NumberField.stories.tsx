import { createTheme, Paper, Stack, ThemeOptions } from '@mui/material';
import * as React from 'react';
import { deepmerge } from '@mui/utils';

import { NumberField, NumberFieldProps } from './NumberField';
import { AdminContext } from '../AdminContext';
import { defaultDarkTheme, defaultLightTheme } from '../theme';

export default { title: 'ra-ui-materialui/fields/NumberField' };

export const Basic = ({
    value,
    theme,
    ...props
}: Partial<NumberFieldProps> & { value?: number; theme?: string }) => {
    return (
        <AdminContext
            theme={theme === 'light' ? defaultLightTheme : defaultDarkTheme}
        >
            <Paper sx={{ p: 2 }}>
                <Stack direction="row">
                    <NumberField record={{ value }} source="value" {...props} />
                </Stack>
            </Paper>
        </AdminContext>
    );
};

Basic.argTypes = {
    value: {
        options: ['integer', 'float', 'zero', 'undefined'],
        mapping: {
            integer: 5,
            float: 75.21,
            zero: 0,
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
    value: 'integer',
};

export const Themed = () => {
    return (
        <AdminContext
            theme={deepmerge(createTheme(), {
                components: {
                    RaNumberField: {
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
                    <NumberField record={{ value: 5 }} source="value" />
                </Stack>
            </Paper>
        </AdminContext>
    );
};
