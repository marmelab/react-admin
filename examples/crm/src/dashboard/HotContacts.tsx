import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, Box, Link } from '@mui/material';
import ContactsIcon from '@mui/icons-material/Contacts';
import { useGetList, SimpleList, useGetIdentity } from 'react-admin';
import { formatDistance } from 'date-fns';

import { Avatar } from '../contacts/Avatar';
import { Contact } from '../types';

export const HotContacts = () => {
    const { identity } = useGetIdentity();
    const {
        data: contactData,
        total: contactTotal,
        isLoading: contactsLoading,
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
                    component={RouterLink}
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
                    isLoading={contactsLoading}
                    primaryText={contact =>
                        `${contact.first_name} ${contact.last_name}`
                    }
                    resource="contacts"
                    secondaryText={(contact: Contact) =>
                        formatDistance(
                            new Date(contact.last_seen),
                            new Date(),
                            {
                                addSuffix: true,
                            }
                        )
                    }
                    leftAvatar={contact => <Avatar record={contact} />}
                />
            </Card>
        </>
    );
};
