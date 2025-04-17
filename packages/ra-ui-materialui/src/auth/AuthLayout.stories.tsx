import * as React from 'react';
import { Avatar, Button, CardContent, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { Form, required } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { TextInput } from '../input';
import { AdminContext } from '../AdminContext';
import { AuthLayout } from './AuthLayout';
import { Stack } from '@mui/system';

export default { title: 'ra-ui-materialui/auth/AuthLayout' };

const i18nProvider = polyglotI18nProvider(() => englishMessages);

export const Basic = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <AuthLayout>
            <CardContent>
                <Stack alignItems="center" gap={2}>
                    <Avatar>
                        <LockIcon color="inherit" />
                    </Avatar>
                    <Typography>
                        Please enter your username to reset your password
                    </Typography>
                    <Form>
                        <TextInput
                            autoFocus
                            source="username"
                            label="ra.auth.username"
                            autoComplete="username"
                            validate={required()}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            fullWidth
                        >
                            Reset my password
                        </Button>
                    </Form>
                </Stack>
            </CardContent>
        </AuthLayout>
    </AdminContext>
);

export const Sx = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <AuthLayout
            sx={{
                backgroundImage:
                    'radial-gradient(circle at 50% 14em, #bb44f0 0%, #9614d0 60%, #660094 100%)',
            }}
        >
            <CardContent>
                <Stack alignItems="center" gap={2}>
                    <Avatar>
                        <LockIcon color="inherit" />
                    </Avatar>
                    <Typography>
                        Please enter your username to reset your password
                    </Typography>
                    <Form>
                        <TextInput
                            autoFocus
                            source="username"
                            label="ra.auth.username"
                            autoComplete="username"
                            validate={required()}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            fullWidth
                        >
                            Reset my password
                        </Button>
                    </Form>
                </Stack>
            </CardContent>
        </AuthLayout>
    </AdminContext>
);
