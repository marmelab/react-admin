import * as React from 'react';
import { Create, Form, Toolbar, useGetIdentity } from 'react-admin';
import { CardContent } from '@mui/material';

import { CompanyInputs } from './CompanyInputs';

export const CompanyCreate = () => {
    const { identity } = useGetIdentity();
    return (
        <Create actions={false} redirect="show">
            <Form defaultValues={{ sales_id: identity?.id }}>
                <CardContent>
                    <CompanyInputs />
                </CardContent>
                <Toolbar />
            </Form>
        </Create>
    );
};
