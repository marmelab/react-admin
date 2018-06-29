import React from 'react';
import {
    BooleanField,
    Create,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    EditButton,
    Filter,
    FormTab,
    List,
    LongTextInput,
    NullableBooleanInput,
    NumberField,
    ReferenceManyField,
    Responsive,
    TabbedForm,
    TextField,
    TextInput,
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/icons/Person';

import NbItemsField from '../commands/NbItemsField';
import ProductReferenceField from '../products/ProductReferenceField';
import StarRatingField from '../reviews/StarRatingField';
import FullNameField from './FullNameField';
import SegmentsField from './SegmentsField';
import SegmentInput from './SegmentInput';
import SegmentsInput from './SegmentsInput';
import CustomerLinkField from './CustomerLinkField';
import MobileGrid from './MobileGrid';

export const VisitorIcon = Icon;

const VisitorFilter = props => (
    <Filter {...props}>
        <TextInput label="pos.search" source="q" alwaysOn />
        <DateInput source="last_seen_gte" />
        <NullableBooleanInput source="has_ordered" />
        <NullableBooleanInput source="has_newsletter" defaultValue />
        <SegmentInput />
    </Filter>
);

const colored = WrappedComponent => {
    const Colored = props =>
        props.record[props.source] > 500 ? (
            <span style={{ color: 'red' }}>
                <WrappedComponent {...props} />
            </span>
        ) : (
            <WrappedComponent {...props} />
        );

    Colored.displayName = `Colored(${WrappedComponent.displayName})`;

    return Colored;
};

export const ColoredNumberField = colored(NumberField);
ColoredNumberField.defaultProps = NumberField.defaultProps;

const listStyles = {
    nb_commands: { color: 'purple' },
};

export const VisitorList = withStyles(listStyles)(({ classes, ...props }) => (
    <List
        {...props}
        filters={<VisitorFilter />}
        sort={{ field: 'last_seen', order: 'DESC' }}
        perPage={25}
    >
        <Responsive
            xsmall={<MobileGrid />}
            medium={
                <Datagrid>
                    <CustomerLinkField />
                    <DateField source="last_seen" type="date" />
                    <NumberField
                        source="nb_commands"
                        label="resources.customers.fields.commands"
                        className={classes.nb_commands}
                    />
                    <ColoredNumberField
                        source="total_spent"
                        options={{ style: 'currency', currency: 'USD' }}
                    />
                    <DateField source="latest_purchase" showTime />
                    <BooleanField source="has_newsletter" label="News." />
                    <SegmentsField />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
));

const VisitorTitle = ({ record }) =>
    record ? <FullNameField record={record} size={32} /> : null;

const editStyles = {
    first_name: { display: 'inline-block' },
    last_name: { display: 'inline-block', marginLeft: 32 },
    email: { width: 544 },
    address: { maxWidth: 544 },
    zipcode: { display: 'inline-block' },
    city: { display: 'inline-block', marginLeft: 32 },
    comment: {
        maxWidth: '20em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

export const VisitorEdit = withStyles(editStyles)(({ classes, ...props }) => (
    <Edit title={<VisitorTitle />} {...props}>
        <TabbedForm>
            <FormTab label="resources.customers.tabs.identity">
                <TextInput
                    source="first_name"
                    formClassName={classes.first_name}
                />
                <TextInput
                    source="last_name"
                    formClassName={classes.last_name}
                />
                <TextInput
                    type="email"
                    source="email"
                    validation={{ email: true }}
                    fullWidth={true}
                    formClassName={classes.email}
                />
                <DateInput source="birthday" />
            </FormTab>
            <FormTab label="resources.customers.tabs.address">
                <LongTextInput
                    source="address"
                    formClassName={classes.address}
                />
                <TextInput source="zipcode" formClassName={classes.zipcode} />
                <TextInput source="city" formClassName={classes.city} />
            </FormTab>
            <FormTab label="resources.customers.tabs.orders">
                <ReferenceManyField
                    addLabel={false}
                    reference="commands"
                    target="customer_id"
                >
                    <Datagrid>
                        <DateField source="date" />
                        <TextField source="reference" />
                        <NbItemsField />
                        <NumberField
                            source="total"
                            options={{ style: 'currency', currency: 'USD' }}
                        />
                        <TextField source="status" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
            <FormTab label="resources.customers.tabs.reviews">
                <ReferenceManyField
                    addLabel={false}
                    reference="reviews"
                    target="customer_id"
                >
                    <Datagrid filter={{ status: 'approved' }}>
                        <DateField source="date" />
                        <ProductReferenceField />
                        <StarRatingField />
                        <TextField
                            source="comment"
                            cellClassName={classes.comment}
                        />
                        <EditButton style={{ padding: 0 }} />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
            <FormTab label="resources.customers.tabs.stats">
                <SegmentsInput />
                <NullableBooleanInput source="has_newsletter" />
                <DateField
                    source="first_seen"
                    style={{ width: 128, display: 'inline-block' }}
                />
                <DateField
                    source="latest_purchase"
                    style={{ width: 128, display: 'inline-block' }}
                />
                <DateField
                    source="last_seen"
                    style={{ width: 128, display: 'inline-block' }}
                />
            </FormTab>
        </TabbedForm>
    </Edit>
));

export const VisitorCreate = withStyles(editStyles)(({ classes, ...props }) => (
    <Create {...props}>
        <TabbedForm>
            <FormTab label="resources.customers.tabs.identity">
                <TextInput
                    source="first_name"
                    formClassName={classes.first_name}
                />
                <TextInput
                    source="last_name"
                    formClassName={classes.last_name}
                />
                <TextInput
                    type="email"
                    source="email"
                    validation={{ email: true }}
                    fullWidth={true}
                    formClassName={classes.email}
                />
                <DateInput source="birthday" />
            </FormTab>
            <FormTab label="resources.customers.tabs.address">
                <LongTextInput
                    source="address"
                    formClassName={classes.address}
                />
                <TextInput source="zipcode" formClassName={classes.zipcode} />
                <TextInput source="city" formClassName={classes.city} />
            </FormTab>
        </TabbedForm>
    </Create>
));
