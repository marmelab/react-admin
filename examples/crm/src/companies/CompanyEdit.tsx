import * as React from 'react';
import { Edit, Form, Toolbar } from 'react-admin';
import { Box, CardContent, Stack } from '@mui/material';

import { CompanyForm } from './CompanyForm';

import { CompanyAside } from './CompanyAside';
import { CompanyAvatar } from './CompanyAvatar';

export const CompanyEdit = () => (
    <Edit aside={<CompanyAside link="show" />} actions={false} redirect="show">
        <Form>
            <CardContent>
                <Stack direction="row">
                    <Box sx={{ mt: 1 }}>
                        <CompanyAvatar />
                    </Box>
                    <Box ml={2} flex="1" maxWidth={796}>
                        <CompanyForm />
                    </Box>
                </Stack>
            </CardContent>
            <Toolbar />
        </Form>
    </Edit>
);
