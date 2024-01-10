import * as React from 'react';
import {
    TextInput,
    ReferenceInput,
    AutocompleteInput,
    BooleanInput,
} from 'react-admin';
import { Divider, Box } from '@mui/material';

export const ContactInputs = () => (
    <Box flex="1" mt={-1}>
        <Box display="flex" width={430}>
            <TextInput source="first_name" fullWidth />
            <Spacer />
            <TextInput source="last_name" fullWidth />
        </Box>
        <Box display="flex" width={430}>
            <TextInput source="title" fullWidth />
            <Spacer />
            <ReferenceInput source="company_id" reference="companies">
                <AutocompleteInput optionText="name" fullWidth />
            </ReferenceInput>
        </Box>
        <Divider />
        <Box mt={2} width={430}>
            <TextInput source="email" fullWidth />
        </Box>
        <Box display="flex" width={430}>
            <TextInput source="phone_number1" fullWidth />
            <Spacer />
            <TextInput source="phone_number2" fullWidth />
        </Box>
        <Divider />
        <Box mt={2} width={430}>
            <TextInput source="background" multiline fullWidth />
            <TextInput source="avatar" fullWidth />
            <BooleanInput source="has_newsletter" />
        </Box>
    </Box>
);

const Spacer = () => <Box width={20} component="span" />;
