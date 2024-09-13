import * as React from 'react';
import { Create, Form, Toolbar, useGetIdentity } from 'react-admin';
import { CardContent } from '@mui/material';

import { CompanyInputs } from './CompanyInputs';

export const CompanyCreate = () => {
    const { identity } = useGetIdentity();
    return (
        <Create
            actions={false}
            redirect="show"
            transform={values => {
                // add https:// before website if not present
                if (values.website && !values.website.startsWith('http')) {
                    values.website = `https://${values.website}`;
                }
                return values;
            }}
        >
            <Form defaultValues={{ sales_id: identity?.id }}>
                <CardContent>
                    <CompanyInputs />
                </CardContent>
                <Toolbar />
            </Form>
        </Create>
    );
};
