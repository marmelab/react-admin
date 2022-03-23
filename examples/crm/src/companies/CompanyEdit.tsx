import * as React from 'react';
import { Edit, Form, Toolbar } from 'react-admin';
import { Box, CardContent, Stack, Avatar } from '@mui/material';

import { CompanyForm } from './CompanyForm';

import { CompanyAside } from './CompanyAside';
import { LogoField } from './LogoField';

export const CompanyEdit = () => {
    return (
        <Edit
            aside={<CompanyAside link="show" />}
            actions={false}
            redirect="show"
        >
            <Form>
                <CardContent>
                    <Stack direction="row">
                        <Avatar sx={{ mt: 1 }}>
                            <LogoField />
                        </Avatar>
                        <Box ml={2} flex="1" maxWidth={796}>
                            <CompanyForm />
                        </Box>
                    </Stack>
                </CardContent>
                <Toolbar />
            </Form>
        </Edit>
    );
};
