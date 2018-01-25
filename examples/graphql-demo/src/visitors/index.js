import React from 'react';
import {
    translate,
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    Delete,
    Edit,
    EditButton,
    Filter,
    FormTab,
    List,
    LongTextInput,
    NullableBooleanInput,
    NumberField,
    ReferenceManyField,
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
import SegmentsField from './SegmentsField';
import SegmentInput from './SegmentInput';

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

const ColoredNumberField = colored(NumberField);
ColoredNumberField.defaultProps = NumberField.defaultProps;

export const VisitorList = props => (
    <List
        {...props}
        filters={<VisitorFilter />}
        sort={{ field: 'last_seen', order: 'DESC' }}
        perPage={25}
    >
        <Datagrid>
            <FullNameField />
            <DateField source="last_seen" type="date" />
            <NumberField
                source="nb_commands"
                label="resources.Customer.fields.commands"
                style={{ color: 'purple' }}
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
    </List>
);

const VisitorTitle = ({ record }) =>
    record ? <FullNameField record={record} size={32} /> : null;

const editStyles = {
    address: { maxWidth: 544 },
    email: { width: 544 },
    first_name: { display: 'inline-block' },
    last_name: { display: 'inline-block', marginLeft: 32 },
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
            <FormTab label="resources.Customer.tabs.reviews">
                <ReferenceManyField
                    addLabel={false}
                    reference="Review"
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
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
            <FormTab label="resources.Customer.tabs.stats">
                <NullableBooleanInput source="has_newsletter" />
                <DateField source="first_seen" formClassName={classes.date} />
                <DateField
                    source="latest_purchase"
                    formClassName={classes.date}
                />
                <DateField source="last_seen" formClassName={classes.date} />
            </FormTab>
        </TabbedForm>
    </Edit>
));

const VisitorDeleteTitle = translate(({ record, translate }) => (
    <span>
        {translate('resources.Customer.page.delete')}&nbsp;
        {record && (
            <img src={`${record.avatar}?size=25x25`} width="25" alt="" />
        )}
        {record && `${record.first_name} ${record.last_name}`}
    </span>
));

export const VisitorDelete = props => (
    <Delete {...props} title={<VisitorDeleteTitle />} />
);
