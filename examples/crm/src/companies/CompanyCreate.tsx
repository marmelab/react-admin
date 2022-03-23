import * as React from 'react';
import { Create, Form, Toolbar } from 'react-admin';
import BusinessIcon from '@mui/icons-material/Business';
import { CardContent, Stack, Avatar, Box } from '@mui/material';

import { CompanyForm } from './CompanyForm';

export const CompanyCreate = () => (
    <Create actions={false} redirect="show">
        <Form>
            <CardContent>
                <Stack direction="row">
                    <Avatar sx={{ mt: 1 }}>
                        <BusinessIcon />
                    </Avatar>
                    <Box ml={2} flex="1" maxWidth={796}>
                        <CompanyForm />
                    </Box>
                </Stack>
            </CardContent>
            <Toolbar />
        </Form>
    </Create>
);
