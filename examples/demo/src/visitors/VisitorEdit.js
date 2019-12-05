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
import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

const styles = theme => ({
    formContent: {
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            display: 'block',
        },
    },
    mainInputGroup: {
        width: 503,
        marginRight: '1em',
        [theme.breakpoints.down('sm')]: { width: '100%', marginRight: 0 },
    },
    secondaryInputGroup: {
        maxWidth: 400,
        [theme.breakpoints.down('sm')]: { marginTop: '1em' },
    },
    first_name: {
        display: 'inline-block',
        [theme.breakpoints.down('sm')]: { display: 'block' },
    },
    last_name: {
        display: 'inline-block',
        marginLeft: '1em',
        [theme.breakpoints.down('sm')]: { display: 'block', marginLeft: 0 },
    },
    zipcode: {
        display: 'inline-block',
        [theme.breakpoints.down('sm')]: { display: 'block' },
    },
    city: {
        display: 'inline-block',
        marginLeft: '1em',
        [theme.breakpoints.down('sm')]: { display: 'block', marginLeft: 0 },
    },
    separator: {
        height: '1em',
    },
});

const useStyles = makeStyles(styles);

const VisitorForm = ({
    basePath,
    initialValues,
    defaultValue,
    record,
    save,
    saving,
    ...props
}) => {
    const classes = useStyles();
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
                        <div className={classes.formContent}>
                            <div className={classes.mainInputGroup}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.customers.fieldGroups.identity'
                                    )}
                                </Typography>
                                <TextInput
                                    source="first_name"
                                    resource="customers"
                                    className={classes.first_name}
                                />
                                <TextInput
                                    source="last_name"
                                    resource="customers"
                                    className={classes.last_name}
                                />
                                <TextInput
                                    type="email"
                                    source="email"
                                    resource="customers"
                                    validation={{ email: true }}
                                    fullWidth
                                />
                                <DateInput
                                    source="birthday"
                                    resource="customers"
                                />
                                <div className={classes.separator} />

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
                                <TextInput
                                    source="zipcode"
                                    resource="customers"
                                    className={classes.zipcode}
                                />
                                <TextInput
                                    source="city"
                                    resource="customers"
                                    className={classes.city}
                                />
                            </div>
                            <div className={classes.secondaryInputGroup}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.customers.fieldGroups.stats'
                                    )}
                                </Typography>
                                <div>
                                    <SegmentsInput />
                                </div>
                                <div>
                                    <NullableBooleanInput
                                        source="has_newsletter"
                                        resource="customers"
                                    />
                                </div>
                            </div>
                        </div>
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
