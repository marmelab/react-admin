import * as React from 'react';
import {
    EditBase,
    EditProps,
    TextInput,
    ReferenceInput,
    AutocompleteInput,
    BooleanInput,
    FormWithRedirect,
    Toolbar,
    useEditContext,
} from 'react-admin';
import { Card, CardContent, Divider, Box } from '@material-ui/core';
import omit from 'lodash/omit';

import { Avatar } from './Avatar';
import { ContactAside } from './ContactAside';
import { Contact } from '../types';

const Spacer = () => <Box width={20} component="span" />;

const ContactEditContent = () => {
    const { record, loaded, save } = useEditContext<Contact>();
    if (!loaded || !record) return null;
    return (
        <Box mt={2} display="flex">
            <Box flex="1">
                <FormWithRedirect
                    record={record}
                    redirect="show"
                    save={save}
                    render={formProps => (
                        <Card>
                            <CardContent>
                                <Box>
                                    <Box display="flex">
                                        <Box mr={2}>
                                            <Avatar record={record} />
                                        </Box>
                                        <Box flex="1" mt={-1}>
                                            <Box display="flex">
                                                <TextInput source="first_name" />
                                                <Spacer />
                                                <TextInput source="last_name" />
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
                            <Toolbar
                                {...omit(formProps, [
                                    // FIXME Not super user firendly way to remove warnings
                                    'dirtyFields',
                                    'dirtyFieldsSinceLastSubmit',
                                    'dirtySinceLastSubmit',
                                    'hasSubmitErrors',
                                    'hasValidationErrors',
                                    'initialValues',
                                    'modifiedSinceLastSubmit',
                                    'submitError',
                                    'submitErrors',
                                    'submitFailed',
                                    'submitSucceeded',
                                    'submitting',
                                    'valid',
                                ])}
                            />
                        </Card>
                    )}
                />
            </Box>
            <ContactAside record={record} link="show" />
        </Box>
    );
};

export const ContactEdit = (props: EditProps) => (
    <EditBase {...props}>
        <ContactEditContent />
    </EditBase>
);
