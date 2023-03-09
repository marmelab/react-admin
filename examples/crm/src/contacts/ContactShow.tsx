import * as React from 'react';
import { ShowBase, useShowContext } from 'react-admin';
import { Box, Card, CardContent, Typography } from '@mui/material';

import { Avatar } from './Avatar';
import { ContactAside } from './ContactAside';
import { LogoField } from '../companies/LogoField';
import { NotesIterator } from '../notes';
import {
    CompanyFields,
    Contact,
    ContactFields,
    ContactNoteFields,
} from '../types';

export const ContactShow = () => (
    <ShowBase>
        <ContactShowContent />
    </ShowBase>
);

const ContactShowContent = () => {
    const { record, isLoading } = useShowContext<Contact>();
    if (isLoading || !record) return null;
    return (
        <Box mt={2} display="flex">
            <Box flex="1">
                <Card>
                    <CardContent>
                        <Box display="flex">
                            <Avatar />
                            <Box ml={2} flex="1">
                                <Typography variant="h5">
                                    {record.first_name} {record.last_name}
                                </Typography>
                                <Typography variant="body2">
                                    {record.title} at{' '}
                                    <ContactFields.ReferenceField
                                        source="company_id"
                                        reference="companies"
                                        link="show"
                                    >
                                        <CompanyFields.TextField source="name" />
                                    </ContactFields.ReferenceField>
                                </Typography>
                            </Box>
                            <Box>
                                <ContactFields.ReferenceField
                                    source="company_id"
                                    reference="companies"
                                    link="show"
                                >
                                    <LogoField />
                                </ContactFields.ReferenceField>
                            </Box>
                        </Box>
                        <ContactNoteFields.ReferenceManyField
                            target="contact_id"
                            reference="contactNotes"
                            sort={{ field: 'date', order: 'DESC' }}
                        >
                            <NotesIterator showStatus reference="contacts" />
                        </ContactNoteFields.ReferenceManyField>
                    </CardContent>
                </Card>
            </Box>
            <ContactAside />
        </Box>
    );
};
