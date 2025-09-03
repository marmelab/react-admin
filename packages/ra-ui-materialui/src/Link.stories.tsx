import * as React from 'react';
import { Paper, Stack } from '@mui/material';
import { AdminContext } from './AdminContext';
import { Link, LinkProps } from './Link';
import { defaultDarkTheme, defaultLightTheme } from './theme';

export default { title: 'ra-ui-materialui/Link' };

export const Basic = ({
    theme,
    value,
    ...props
}: Partial<LinkProps> & { theme?: string; value?: string }) => {
    return (
        <AdminContext
            theme={
                theme === 'light'
                    ? defaultLightTheme
                    : theme === 'dark'
                      ? defaultDarkTheme
                      : {
                            components: {
                                RaLink: {
                                    styleOverrides: {
                                        root: {
                                            color: 'purple',
                                        },
                                    },
                                },
                            },
                        }
            }
        >
            <Paper sx={{ p: 2 }}>
                <Stack direction="row">
                    <Link to="/" {...props}>
                        Test
                    </Link>
                </Stack>
            </Paper>
        </AdminContext>
    );
};

Basic.argTypes = {
    theme: {
        options: ['light', 'dark', 'custom'],
        control: { type: 'select' },
    },
};
Basic.args = {
    theme: 'light',
};
