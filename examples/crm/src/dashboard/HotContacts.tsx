import * as React from 'react';
import { Card, Box } from '@mui/material';
import ContactsIcon from '@mui/icons-material/Contacts';
import { useGetList, Link, SimpleList, useGetIdentity } from 'react-admin';
import { formatDistance } from 'date-fns';

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
        <>
            <Box display="flex" alignItems="center" marginBottom="1em">
                <Box ml={2} mr={2} display="flex">
                    <ContactsIcon color="disabled" fontSize="large" />
                </Box>
                <Link
                    underline="none"
                    variant="h5"
                    color="textSecondary"
                    to="/contacts"
                >
                    Hot contacts
                </Link>
            </Box>
            <Card>
                <SimpleList<Contact>
                    linkType="show"
                    data={contactData}
                    total={contactTotal}
                    isPending={contactsLoading}
                    primaryText={contact =>
                        `${contact.first_name} ${contact.last_name}`
                    }
                    resource="contacts"
                    secondaryText={(contact: Contact) =>
                        formatDistance(contact.last_seen, new Date(), {
                            addSuffix: true,
                        })
                    }
                    leftAvatar={contact => <Avatar record={contact} />}
                    dense
                />
            </Card>
        </>
    );
};
