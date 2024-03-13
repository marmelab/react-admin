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
            <TextInput source="first_name" />
            <Spacer />
            <TextInput source="last_name" />
        </Box>
        <Box display="flex" width={430}>
            <TextInput source="title" />
            <Spacer />
            <ReferenceInput source="company_id" reference="companies">
                <AutocompleteInput optionText="name" />
            </ReferenceInput>
        </Box>
        <Divider />
        <Box mt={2} width={430}>
            <TextInput source="email" />
        </Box>
        <Box display="flex" width={430}>
            <TextInput source="phone_number1" />
            <Spacer />
            <TextInput source="phone_number2" />
        </Box>
        <Divider />
        <Box mt={2} width={430}>
            <TextInput source="background" multiline />
            <TextInput source="avatar" />
            <BooleanInput source="has_newsletter" />
        </Box>
    </Box>
);

const Spacer = () => <Box width={20} component="span" />;
