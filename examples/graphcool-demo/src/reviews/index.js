import React from 'react';
import {
    AutocompleteInput,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    EditButton,
    Filter,
    List,
    LongTextInput,
    ReferenceField,
    ReferenceInput,
    Responsive,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';
import { withStyles } from 'material-ui/styles';
import Icon from '@material-ui/icons/Comment';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import ApproveButton from './ApproveButton';
import ReviewEditActions from './ReviewEditActions';
import rowStyle from './rowStyle';
import MobileGrid from './MobileGrid';

export const ReviewIcon = Icon;

export const ReviewFilter = props => (
    <Filter {...props}>
        <TextInput label="pos.search" source="q" alwaysOn />
        <SelectInput
            source="status"
            choices={[
                { id: 'accepted', name: 'Accepted' },
                { id: 'pending', name: 'Pending' },
                { id: 'rejected', name: 'Rejected' },
            ]}
            elStyle={{ width: 150 }}
        />
        <ReferenceInput source="customer.id" reference="Customer">
            <AutocompleteInput
                optionText={choice => `${choice.firstName} ${choice.lastName}`}
            />
        </ReferenceInput>
        <ReferenceInput source="product.id" reference="Product">
            <AutocompleteInput optionText="reference" />
        </ReferenceInput>
        <DateInput source="date_gte" />
        <DateInput source="date_lte" />
    </Filter>
);

const styles = {
    commentCell: {
        maxWidth: '18em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    button: { padding: 0 },
};

export const ReviewList = withStyles(styles)(({ classes, ...props }) => (
    <List
        {...props}
        filters={<ReviewFilter />}
        perPage={25}
        sort={{ field: 'date', order: 'DESC' }}
    >
        <Responsive
            xsmall={<MobileGrid />}
            medium={
                <Datagrid rowStyle={rowStyle}>
                    <DateField source="date" />
                    <CustomerReferenceField />
                    <ProductReferenceField />
                    <StarRatingField />
                    <TextField
                        source="comment"
                        cellClassName={classes.comment}
                    />
                    <TextField source="status" />
                    <ApproveButton className={classes.button} />
                    <EditButton className={classes.button} />
                </Datagrid>
            }
        />
    </List>
));

const editStyles = {
    detail: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginRight: '2em',
        minWidth: '8em',
    },
};
export const ReviewEdit = withStyles(editStyles)(({ classes, ...props }) => (
    <Edit {...props} actions={<ReviewEditActions />}>
        <SimpleForm>
            <DateField source="date" className={classes.detail} />
            <CustomerReferenceField className={classes.detail} />
            <ProductReferenceField className={classes.detail} />
            <ReferenceField
                source="command.id"
                reference="Command"
                addLabel
                className={classes.detail}
            >
                <TextField source="reference" />
            </ReferenceField>
            <StarRatingField className={classes.detail} />
            <LongTextInput source="comment" />
            <SelectInput
                source="status"
                choices={[
                    { id: 'accepted', name: 'Accepted' },
                    { id: 'pending', name: 'Pending' },
                    { id: 'rejected', name: 'Rejected' },
                ]}
            />
        </SimpleForm>
    </Edit>
));
