import { Paper, Stack } from '@mui/material';
import * as React from 'react';

import { ChipField, ChipFieldProps } from './ChipField';
import { AdminContext } from '../AdminContext';
import { defaultDarkTheme, defaultLightTheme } from '../theme';

export default { title: 'ra-ui-materialui/fields/ChipField' };

export const Basic = ({
    theme,
    value,
    ...props
}: Partial<ChipFieldProps> & { theme?: string; value?: string }) => {
    return (
        <AdminContext
            theme={theme === 'light' ? defaultLightTheme : defaultDarkTheme}
        >
            <Paper sx={{ p: 2 }}>
                <Stack direction="row">
                    <ChipField record={{ value }} source="value" {...props} />
                </Stack>
            </Paper>
        </AdminContext>
    );
};

Basic.argTypes = {
    value: {
        options: ['filled', 'empty', 'zero', 'undefined'],
        mapping: {
            filled: 'Bazinga',
            empty: '',
            zero: 0,
            undefined: undefined,
        },
        control: { type: 'select' },
    },
    emptyText: {
        options: ['default', 'empty', 'provided'],
        mapping: {
            default: undefined,
            empty: '',
            provided: 'Nothing here',
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
