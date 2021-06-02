import * as React from 'react';
import {
    CreateBase,
    CreateProps,
    TextInput,
    ReferenceInput,
    AutocompleteInput,
    BooleanInput,
    FormWithRedirect,
    Toolbar,
    required,
    useCreateContext,
} from 'react-admin';
import { Card, CardContent, Divider, Box, Avatar } from '@material-ui/core';

import { Contact } from '../types';

const Spacer = () => <Box width={20} component="span" />;

export const ContactCreate = (props: CreateProps) => (
    <CreateBase
        {...props}
        transform={(data: Contact) => ({
            ...data,
            last_seen: new Date(),
            tags: [],
        })}
    >
        <ContactCreateContent />
    </CreateBase>
);

const ContactCreateContent = () => {
    const { save, record } = useCreateContext();
    return (
        <Box mt={2} display="flex">
            <Box flex="1">
                <FormWithRedirect
                    redirect="show"
                    record={record as any}
                    save={save}
                    render={formProps => (
                        <Card>
                            <CardContent>
                                <Box>
                                    <Box display="flex">
                                        <Box mr={2}>
                                            <Avatar />
                                        </Box>
                                        <Box flex="1" mt={-1}>
                                            <Box display="flex">
                                                <TextInput
                                                    source="first_name"
                                                    validate={[required()]}
                                                />
                                                <Spacer />
                                                <TextInput
                                                    source="last_name"
                                                    validate={[required()]}
                                                />
                                            </Box>
                                            <Box display="flex">
                                                <TextInput source="title" />
                                                <Spacer />
                                                <ReferenceInput
                                                    source="company_id"
                                                    reference="companies"
                                                >
                                                    <AutocompleteInput optionText="name" />
                                                </ReferenceInput>
                                            </Box>
                                            <Divider />
                                            <Box mt={2} width={430}>
                                                <TextInput
                                                    source="email"
                                                    fullWidth
                                                />
                                            </Box>
                                            <Box display="flex">
                                                <TextInput source="phone_number1" />
                                                <Spacer />
                                                <TextInput source="phone_number2" />
                                            </Box>
                                            <Divider />
                                            <Box mt={2} width={430}>
                                                <TextInput
                                                    source="background"
                                                    multiline
                                                    fullWidth
                                                />
                                                <TextInput
                                                    source="avatar"
                                                    fullWidth
                                                />
                                                <BooleanInput source="has_newsletter" />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                            <Toolbar {...formProps} />
                        </Card>
                    )}
                />
            </Box>
        </Box>
    );
};
