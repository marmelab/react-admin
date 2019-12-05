import React from 'react';
import {
    DateInput,
    Edit,
    NullableBooleanInput,
    TextInput,
    Toolbar,
    sanitizeEmptyValues,
    useTranslate,
} from 'react-admin';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Box, Card, CardContent, Typography } from '@material-ui/core';

import Aside from './Aside';
import FullNameField from './FullNameField';
import SegmentsInput from './SegmentsInput';

const VisitorEdit = props => {
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

const VisitorTitle = ({ record }) =>
    record ? <FullNameField record={record} size={32} /> : null;

const VisitorForm = ({
    basePath,
    initialValues,
    defaultValue,
    record,
    save,
    saving,
    ...props
}) => {
    const translate = useTranslate();

    const submit = values => {
        save(sanitizeEmptyValues(record, values));
    };

    return (
        <Form
            initialValues={record}
            onSubmit={submit}
            mutators={{ ...arrayMutators }} // necessary for ArrayInput
            subscription={defaultSubscription} // don't redraw entire form each time one field changes
            key={props.version} // support for refresh button
            keepDirtyOnReinitialize
            render={formProps => (
                <Card>
                    <CardContent>
                        <Box display={{ md: 'block', lg: 'flex' }}>
                            <Box flex={2} mr={{ md: 0, lg: '1em' }}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.customers.fieldGroups.identity'
                                    )}
                                </Typography>
                                <Box display={{ xs: 'block', sm: 'flex' }}>
                                    <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                        <TextInput
                                            source="first_name"
                                            resource="customers"
                                            fullWidth
                                        />
                                    </Box>
                                    <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                                        <TextInput
                                            source="last_name"
                                            resource="customers"
                                            fullWidth
                                        />
                                    </Box>
                                </Box>
                                <TextInput
                                    type="email"
                                    source="email"
                                    resource="customers"
                                    validation={{ email: true }}
                                    fullWidth
                                />
                                <Box display={{ xs: 'block', sm: 'flex' }}>
                                    <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                        <DateInput
                                            source="birthday"
                                            resource="customers"
                                            fullWidth
                                        />
                                    </Box>
                                    <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
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
                                />
                                <Box display={{ xs: 'block', sm: 'flex' }}>
                                    <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                        <TextInput
                                            source="zipcode"
                                            resource="customers"
                                            fullWidth
                                        />
                                    </Box>
                                    <Box flex={2} ml={{ xs: 0, sm: '0.5em' }}>
                                        <TextInput
                                            source="city"
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
                        record={record}
                        basePath={basePath}
                        undoable={true}
                        invalid={formProps.invalid}
                        handleSubmit={formProps.handleSubmit}
                        saving={saving}
                        resource="customers"
                    />
                </Card>
            )}
        />
    );
};

const defaultSubscription = {
    submitting: true,
    pristine: true,
    valid: true,
    invalid: true,
};

export default VisitorEdit;
