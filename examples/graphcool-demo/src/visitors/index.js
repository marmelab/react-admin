import React from 'react';
import {
    BooleanField,
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
import Icon from 'material-ui-icons/Person';
import { withStyles } from 'material-ui/styles';

import NbItemsField from '../commands/NbItemsField';
import ProductReferenceField from '../products/ProductReferenceField';
import StarRatingField from '../reviews/StarRatingField';
import FullNameField from './FullNameField';
import SegmentReferenceField from '../segments/SegmentReferenceField';
import MobileGrid from './MobileGrid';

export const VisitorIcon = Icon;

const VisitorFilter = props => (
    <Filter {...props}>
        <TextInput label="pos.search" source="q" alwaysOn />
        <DateInput source="lastSeen_gte" />
        <NullableBooleanInput source="hasOrdered" />
        <NullableBooleanInput source="hasNewsletter" defaultValue />
    </Filter>
);

const colored = WrappedComponent => {
    const component = props =>
        props.record[props.source] > 500 ? (
            <span style={{ color: 'red' }}>
                <WrappedComponent {...props} />
            </span>
        ) : (
            <WrappedComponent {...props} />
        );

    component.displayName = `Colored(${WrappedComponent.displayName})`;

    return component;
};

export const ColoredNumberField = colored(NumberField);
ColoredNumberField.defaultProps = NumberField.defaultProps;

export const VisitorList = props => (
    <List
        {...props}
        filters={<VisitorFilter />}
        sort={{ field: 'lastSeen', order: 'DESC' }}
        perPage={25}
    >
        <Responsive
            xsmall={<MobileGrid />}
            medium={
                <Datagrid>
                    <FullNameField />
                    <DateField source="lastSeen" type="date" />
                    <NumberField
                        source="nbCommands"
                        label="resources.Customer.fields.commands"
                        style={{ color: 'purple' }}
                    />
                    <ColoredNumberField
                        source="totalSpent"
                        options={{ style: 'currency', currency: 'USD' }}
                    />
                    <DateField source="latestPurchase" showTime />
                    <BooleanField source="hasNewsletter" label="News." />
                    <SegmentReferenceField />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
);

const VisitorTitle = ({ record }) =>
    record ? <FullNameField record={record} size={32} /> : null;

const editStyles = {
    address: { maxWidth: 544 },
    email: { width: 544 },
    firstName: { display: 'inline-block' },
    lastName: { display: 'inline-block', marginLeft: 32 },
    zipcode: { display: 'inline-block' },
    city: { display: 'inline-block', marginLeft: 32 },
    comment: {
        maxWidth: '20em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    date: { width: 128, display: 'inline-block' },
};

export const VisitorEdit = withStyles(editStyles)(({ classes, ...props }) => (
    <Edit title={<VisitorTitle />} {...props}>
        <TabbedForm>
            <FormTab label="resources.Customer.tabs.identity">
                <TextInput
                    source="firstName"
                    formClassName={classes.firstName}
                />
                <TextInput source="lastName" formClassName={classes.lastName} />
                <TextInput
                    type="email"
                    source="email"
                    validation={{ email: true }}
                    options={{ fullWidth: true }}
                    formClassName={classes.email}
                />
                <DateInput source="birthday" />
            </FormTab>
            <FormTab label="resources.Customer.tabs.address">
                <LongTextInput
                    source="address"
                    formClassName={classes.address}
                />
                <TextInput source="zipcode" formClassName={classes.zipcode} />
                <TextInput source="city" formClassName={classes.city} />
            </FormTab>
            <FormTab label="resources.Customer.tabs.orders">
                <ReferenceManyField
                    addLabel={false}
                    reference="Command"
                    target="customer.id"
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
            <FormTab label="resources.Customer.tabs.reviews">
                <ReferenceManyField
                    addLabel={false}
                    reference="Review"
                    target="customer.id"
                >
                    <Datagrid filter={{ status: 'approved' }}>
                        <DateField source="date" />
                        <ProductReferenceField />
                        <StarRatingField />
                        <TextField
                            source="comment"
                            cellClassName={classes.comment}
                        />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
            <FormTab label="resources.Customer.tabs.stats">
                <NullableBooleanInput source="hasNewsletter" />
                <DateField source="firstSeen" formClassName={classes.date} />
                <DateField
                    source="latestPurchase"
                    formClassName={classes.date}
                />
                <DateField source="lastSeen" formClassName={classes.date} />
            </FormTab>
        </TabbedForm>
    </Edit>
));
