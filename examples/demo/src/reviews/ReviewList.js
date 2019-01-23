import React from 'react';
import {
    BulkActions,
    BulkDeleteAction,
    Datagrid,
    DateField,
    EditButton,
    List,
    Responsive,
    TextField,
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import ApproveButton from './ApproveButton';
import BulkApproveAction from './BulkApproveAction';
import BulkRejectAction from './BulkRejectAction';
import rowStyle from './rowStyle';
import MobileGrid from './MobileGrid';
import ReviewFilter from './ReviewFilter';

const listStyles = {
    headerRow: {
        borderLeftColor: 'white',
        borderLeftWidth: 5,
        borderLeftStyle: 'solid',
    },
    comment: {
        maxWidth: '18em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

const ReviewsBulkActions = props => (
    <BulkActions {...props}>
        <BulkApproveAction label="resources.reviews.action.accept" />
        <BulkRejectAction label="resources.reviews.action.reject" />
        <BulkDeleteAction />
    </BulkActions>
);

const ReviewList = ({ classes, ...props }) => (
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
                <Datagrid
                    rowStyle={rowStyle}
                    classes={{ headerRow: classes.headerRow }}
                >
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
);

export default withStyles(listStyles)(ReviewList);
