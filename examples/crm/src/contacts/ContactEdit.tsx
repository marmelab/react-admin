import * as React from 'react';
import {
    EditBase,
    Form,
    SaveButton,
    Toolbar,
    useEditContext,
} from 'react-admin';
import { Card, CardContent, Box } from '@mui/material';

import { ContactInputs } from './ContactInputs';
import { ContactAside } from './ContactAside';
import { Contact } from '../types';

export const ContactEdit = () => (
    <EditBase redirect="show">
        <ContactEditContent />
    </EditBase>
);

const ContactEditContent = () => {
    const { isPending, record } = useEditContext<Contact>();
    if (isPending || !record) return null;
    return (
        <Box mt={2} display="flex">
            <Box flex="1">
                <Form>
                    <Card>
                        <CardContent>
                            <ContactInputs />
                        </CardContent>
                        <Toolbar>
                            <SaveButton />
                        </Toolbar>
                    </Card>
                </Form>
            </Box>
            <ContactAside link="show" />
        </Box>
    );
};
