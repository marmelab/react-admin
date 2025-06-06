import { Paper, Stack } from '@mui/material';
import * as React from 'react';

import { DateField, DateFieldProps } from './DateField';
import { AdminContext } from '../AdminContext';
import { defaultDarkTheme, defaultLightTheme } from '../theme';

export default { title: 'ra-ui-materialui/fields/DateField' };

export const Basic = ({
    value,
    theme,
    ...props
}: Partial<DateFieldProps> & { value?: Date | string; theme?: string }) => {
    return (
        <AdminContext
            theme={theme === 'light' ? defaultLightTheme : defaultDarkTheme}
        >
            <Paper sx={{ p: 2 }}>
                <Stack direction="row">
                    <DateField record={{ value }} source="value" {...props} />
                </Stack>
            </Paper>
        </AdminContext>
    );
};

Basic.argTypes = {
    value: {
        options: ['now', 'string', 'empty', 'undefined'],
        mapping: {
            now: new Date(),
            string: '2025-03-25 12:52:11',
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
    value: 'now',
};
