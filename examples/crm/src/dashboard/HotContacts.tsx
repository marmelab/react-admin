import * as React from 'react';
import { Card, Box, Stack } from '@mui/material';
import ContactsIcon from '@mui/icons-material/Contacts';
import { useGetList, Link, SimpleList, useGetIdentity } from 'react-admin';

import { Avatar } from '../contacts/Avatar';
import { Contact } from '../types';

export const HotContacts = () => {
    const { identity } = useGetIdentity();
    const {
        data: contactData,
        total: contactTotal,
        isPending: contactsLoading,
    } = useGetList<Contact>(
        'contacts',
        {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'last_seen', order: 'DESC' },
            filter: { status: 'hot', sales_id: identity?.id },
        },
        { enabled: Number.isInteger(identity?.id) }
    );

    return (
        <Stack>
            <Box display="flex" alignItems="center" mb={1}>
                <Box mr={1} display="flex">
                    <ContactsIcon color="disabled" fontSize="medium" />
                </Box>
                <Link
                    underline="none"
                    variant="h5"
                    color="textSecondary"
                    to="/contacts"
                >
                    Hot Contacts
                </Link>
            </Box>
            <Card>
                <SimpleList<Contact>
                    linkType="show"
                    data={contactData}
                    total={contactTotal}
                    isPending={contactsLoading}
                    resource="contacts"
                    primaryText={contact =>
                        `${contact.first_name} ${contact.last_name}`
                    }
                    secondaryText={contact => (
                        <>
                            {contact.title} at {contact.company_name}
                        </>
                    )}
                    leftAvatar={contact => <Avatar record={contact} />}
                    dense
                />
            </Card>
        </Stack>
    );
};
