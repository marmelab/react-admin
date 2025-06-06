import { Paper, Stack } from '@mui/material';
import * as React from 'react';

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
