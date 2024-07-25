import * as React from 'react';
import { Edit, Form, Toolbar } from 'react-admin';
import { CardContent } from '@mui/material';

import { CompanyInputs } from './CompanyInputs';

import { CompanyAside } from './CompanyAside';

export const CompanyEdit = () => (
    <Edit aside={<CompanyAside link="show" />} actions={false} redirect="show">
        <Form>
            <CardContent>
                <CompanyInputs />
            </CardContent>
            <Toolbar />
        </Form>
    </Edit>
);
