import React, { FC } from 'react';
import {
    DateInput,
    Edit,
    NullableBooleanInput,
    TextInput,
    PasswordInput,
    Toolbar,
    useTranslate,
    FormWithRedirect,
    required,
    email,
} from 'react-admin';
import { Box, Card, CardContent, Typography } from '@material-ui/core';

import Aside from './Aside';
import FullNameField from './FullNameField';
import SegmentsInput from './SegmentsInput';
import { validatePasswords } from './VisitorCreate';
import { Customer, FieldProps } from '../types';

const VisitorEdit = (props: any) => {
    return (
        <Edit
            title={<VisitorTitle />}
            aside={<Aside />}
            component="div"
            {...props}
        >
            <VisitorForm />
        </Edit>
    );
};

const VisitorTitle: FC<FieldProps<Customer>> = ({ record }) =>
    record ? <FullNameField record={record} size="32" /> : null;

const VisitorForm = (props: any) => {
    const translate = useTranslate();

    return (
        <FormWithRedirect
            {...props}
            validate={validatePasswords}
            render={(formProps: any) => (
                <Card>
                    <form>
                        <CardContent>
                            <Box display={{ md: 'block', lg: 'flex' }}>
                                <Box flex={2} mr={{ md: 0, lg: '1em' }}>
                                    <Typography variant="h6" gutterBottom>
                                        {translate(
                                            'resources.customers.fieldGroups.identity'
                                        )}
                                    </Typography>
                                    <Box display={{ xs: 'block', sm: 'flex' }}>
                                        <Box
                                            flex={1}
                                            mr={{ xs: 0, sm: '0.5em' }}
                                        >
                                            <TextInput
                                                source="first_name"
                                                resource="customers"
                                                validate={requiredValidate}
                                                fullWidth
                                            />
                                        </Box>
                                        <Box
                                            flex={1}
                                            ml={{ xs: 0, sm: '0.5em' }}
                                        >
                                            <TextInput
                                                source="last_name"
                                                resource="customers"
                                                validate={requiredValidate}
                                                fullWidth
                                            />
                                        </Box>
                                    </Box>
                                    <TextInput
                                        type="email"
                                        source="email"
                                        resource="customers"
                                        validate={[email(), required()]}
                                        fullWidth
                                    />
                                    <Box display={{ xs: 'block', sm: 'flex' }}>
                                        <Box
                                            flex={1}
                                            mr={{ xs: 0, sm: '0.5em' }}
                                        >
                                            <DateInput
                                                source="birthday"
                                                resource="customers"
                                                fullWidth
                                                helperText={false}
                                            />
                                        </Box>
                                        <Box
                                            flex={2}
                                            ml={{ xs: 0, sm: '0.5em' }}
                                        />
                                    </Box>

                                    <Box mt="1em" />

                                    <Typography variant="h6" gutterBottom>
                                        {translate(
                                            'resources.customers.fieldGroups.address'
                                        )}
                                    </Typography>
                                    <TextInput
                                        source="address"
                                        resource="customers"
                                        multiline
                                        fullWidth
                                        helperText={false}
                                    />
                                    <Box display={{ xs: 'block', sm: 'flex' }}>
                                        <Box
                                            flex={1}
                                            mr={{ xs: 0, sm: '0.5em' }}
                                        >
                                            <TextInput
                                                source="zipcode"
                                                resource="customers"
                                                fullWidth
                                                helperText={false}
                                            />
                                        </Box>
                                        <Box
                                            flex={2}
                                            ml={{ xs: 0, sm: '0.5em' }}
                                        >
                                            <TextInput
                                                source="city"
                                                resource="customers"
                                                fullWidth
                                                helperText={false}
                                            />
                                        </Box>
                                    </Box>

                                    <Box mt="1em" />

                                    <Typography variant="h6" gutterBottom>
                                        {translate(
                                            'resources.customers.fieldGroups.change_password'
                                        )}
                                    </Typography>
                                    <Box display={{ xs: 'block', sm: 'flex' }}>
                                        <Box
                                            flex={1}
                                            mr={{ xs: 0, sm: '0.5em' }}
                                        >
                                            <PasswordInput
                                                source="password"
                                                resource="customers"
                                                fullWidth
                                            />
                                        </Box>
                                        <Box
                                            flex={1}
                                            ml={{ xs: 0, sm: '0.5em' }}
                                        >
                                            <PasswordInput
                                                source="confirm_password"
                                                resource="customers"
                                                fullWidth
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    flex={1}
                                    ml={{ xs: 0, lg: '1em' }}
                                    mt={{ xs: '1em', lg: 0 }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        {translate(
                                            'resources.customers.fieldGroups.stats'
                                        )}
                                    </Typography>
                                    <div>
                                        <SegmentsInput fullWidth />
                                    </div>
                                    <div>
                                        <NullableBooleanInput
                                            source="has_newsletter"
                                            resource="customers"
                                        />
                                    </div>
                                </Box>
                            </Box>
                        </CardContent>
                        <Toolbar
                            record={formProps.record}
                            basePath={formProps.basePath}
                            undoable={true}
                            invalid={formProps.invalid}
                            handleSubmit={formProps.handleSubmit}
                            saving={formProps.saving}
                            resource="customers"
                        />
                    </form>
                </Card>
            )}
        />
    );
};

const requiredValidate = [required()];

export default VisitorEdit;
