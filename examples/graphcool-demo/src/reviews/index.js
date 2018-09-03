import React from 'react';
import {
    AutocompleteInput,
    BulkActions,
    BulkDeleteAction,
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
    SearchInput,
    SelectInput,
    SimpleForm,
    TextField,
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/icons/Comment';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import ApproveButton from './ApproveButton';
import ReviewEditActions from './ReviewEditActions';
import BulkApproveAction from './BulkApproveAction';
import BulkRejectAction from './BulkRejectAction';
import rowStyle from './rowStyle';
import MobileGrid from './MobileGrid';

export const ReviewIcon = Icon;

const filterStyles = {
    status: { width: 150 },
};

export const ReviewFilter = withStyles(filterStyles)(
    ({ classes, ...props }) => (
        <Filter {...props}>
            <SearchInput source="q" alwaysOn />
            <SelectInput
                source="status"
                choices={[
                    { id: 'accepted', name: 'Accepted' },
                    { id: 'pending', name: 'Pending' },
                    { id: 'rejected', name: 'Rejected' },
                ]}
                className={classes.status}
            />
            <ReferenceInput source="customer.id" reference="Customer">
                <AutocompleteInput
                    optionText={choice =>
                        `${choice.firstName} ${choice.lastName}`
                    }
                />
            </ReferenceInput>
            <ReferenceInput source="product.id" reference="Product">
                <AutocompleteInput optionText="reference" />
            </ReferenceInput>
            <DateInput source="date_gte" />
            <DateInput source="date_lte" />
        </Filter>
    )
);

const listStyles = {
    comment: {
        maxWidth: '18em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

const ReviewsBulkActions = props => (
    <BulkActions {...props}>
        <BulkApproveAction label="resources.Review.action.accept" />
        <BulkRejectAction label="resources.Review.action.reject" />
        <BulkDeleteAction />
    </BulkActions>
);

export const ReviewList = withStyles(listStyles)(({ classes, ...props }) => (
    <List
        {...props}
        bulkActions={<ReviewsBulkActions />}
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
                    <ApproveButton />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
));

const editStyle = {
    detail: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginRight: '2em',
        minWidth: '8em',
    },
};
export const ReviewEdit = withStyles(editStyle)(({ classes, ...props }) => (
    <Edit {...props} actions={<ReviewEditActions />}>
        <SimpleForm>
            <DateField source="date" formClassName={classes.detail} />
            <CustomerReferenceField formClassName={classes.detail} />
            <ProductReferenceField formClassName={classes.detail} />
            <ReferenceField
                source="command.id"
                reference="Command"
                addLabel
                formClassName={classes.detail}
            >
                <TextField source="reference" />
            </ReferenceField>
            <StarRatingField formClassName={classes.detail} />
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
