import * as React from 'react';
import {
    ShowBase,
    TextField,
    ReferenceField,
    ReferenceManyField,
    useShowContext,
} from 'react-admin';
import { Box, Card, CardContent, Typography } from '@mui/material';

import { Avatar } from './Avatar';
import { ContactAside } from './ContactAside';
import { NotesIterator } from '../notes';
import { Contact } from '../types';
import { CompanyAvatar } from '../companies/CompanyAvatar';

export const ContactShow = () => (
    <ShowBase>
        <ContactShowContent />
    </ShowBase>
);

const ContactShowContent = () => {
    const { record, isPending } = useShowContext<Contact>();
    if (isPending || !record) return null;

    return (
        <Box mt={2} mb={2} display="flex">
            <Box flex="1">
                <Card>
                    <CardContent>
                        <Box display="flex">
                            <Avatar />
                            <Box ml={2} flex="1">
                                <Typography variant="h5">
                                    {record.first_name} {record.last_name}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    {record.title}
                                    {record.title &&
                                        record.company_id != null &&
                                        ' at '}
                                    {record.company_id != null && (
                                        <ReferenceField
                                            source="company_id"
                                            reference="companies"
                                            link="show"
                                        >
                                            <TextField source="name" />
                                        </ReferenceField>
                                    )}
                                </Typography>
                            </Box>
                            <Box>
                                <ReferenceField
                                    source="company_id"
                                    reference="companies"
                                    link="show"
                                    sx={{ '& a': { textDecoration: 'none' } }}
                                >
                                    <CompanyAvatar />
                                </ReferenceField>
                            </Box>
                        </Box>
                        <ReferenceManyField
                            target="contact_id"
                            reference="contactNotes"
                            sort={{ field: 'date', order: 'DESC' }}
                        >
                            <NotesIterator showStatus reference="contacts" />
                        </ReferenceManyField>
                    </CardContent>
                </Card>
            </Box>
            <ContactAside />
        </Box>
    );
};
