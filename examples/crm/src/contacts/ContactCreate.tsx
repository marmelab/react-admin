import * as React from 'react';
import { CreateBase, Form, Toolbar } from 'react-admin';
import { Card, CardContent, Box, Avatar } from '@mui/material';

import { ContactInputs } from './ContactInputs';
import { Contact } from '../types';

export const ContactCreate = () => (
    <CreateBase
        redirect="show"
        transform={(data: Contact) => ({
            ...data,
            last_seen: new Date(),
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
