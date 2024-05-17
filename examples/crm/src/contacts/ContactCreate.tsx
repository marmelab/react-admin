import * as React from 'react';
import { CreateBase, Form, Toolbar, useGetIdentity } from 'react-admin';
import { Card, CardContent, Box, Avatar } from '@mui/material';

import { ContactInputs } from './ContactInputs';
import { Contact } from '../types';

export const ContactCreate = () => {
    const { identity } = useGetIdentity();
    return (
        <CreateBase
            redirect="show"
            transform={(data: Contact) => ({
                ...data,
                first_seen: new Date().toISOString(),
                last_seen: new Date().toISOString(),
                sales_id: identity?.id,
                tags: [],
            })}
        >
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
            </Box>
        </CreateBase>
    );
};
