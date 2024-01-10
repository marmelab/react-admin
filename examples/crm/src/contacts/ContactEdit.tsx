import * as React from 'react';
import { EditBase, Form, Toolbar, useEditContext } from 'react-admin';
import { Card, CardContent, Box } from '@mui/material';

import { Avatar } from './Avatar';
import { ContactInputs } from './ContactInputs';
import { ContactAside } from './ContactAside';
import { Contact } from '../types';

export const ContactEdit = () => (
    <EditBase redirect="show">
        <ContactEditContent />
    </EditBase>
);

const ContactEditContent = () => {
    const { isLoading, record } = useEditContext<Contact>();
    if (isLoading || !record) return null;
    return (
        <Box mt={2} display="flex">
            <Box flex="1">
                <Form>
                    <Card>
                        <CardContent>
                            <Box>
                                <Box display="flex">
                                    <Box mr={2}>
                                        <Avatar />
                                    </Box>
                                    <ContactInputs />
                                </Box>
                            </Box>
                        </CardContent>
                        <Toolbar />
                    </Card>
                </Form>
            </Box>
            <ContactAside link="show" />
        </Box>
    );
};
