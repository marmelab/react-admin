import React, { Fragment, Component } from 'react';
import {
    BulkActions,
    BulkDeleteAction,
    Datagrid,
    DateField,
    List,
    Responsive,
    TextField,
} from 'react-admin';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Route } from 'react-router';
import Drawer from '@material-ui/core/Drawer';
import withStyles from '@material-ui/core/styles/withStyles';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';

import BulkApproveAction from './BulkApproveAction';
import BulkRejectAction from './BulkRejectAction';
import rowStyle from './rowStyle';
import ReviewMobileList from './ReviewMobileList';
import ReviewFilter from './ReviewFilter';
import ReviewEdit from './ReviewEdit';

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

class ReviewList extends Component {
    render() {
        const { classes, ...props } = this.props;
        return (
            <Fragment>
                <List
                    {...props}
                    bulkActions={<ReviewsBulkActions />}
                    filters={<ReviewFilter />}
                    perPage={25}
                    sort={{ field: 'date', order: 'DESC' }}
                >
                    <Responsive
                        xsmall={<ReviewMobileList />}
                        medium={
                            <Datagrid
                                rowClick="edit"
                                rowStyle={rowStyle}
                                classes={{ headerRow: classes.headerRow }}
                            >
                                <DateField source="date" />
                                <CustomerReferenceField linkType={false} />
                                <ProductReferenceField linkType={false} />
                                <StarRatingField />
                                <TextField
                                    source="comment"
                                    cellClassName={classes.comment}
                                />
                                <TextField source="status" />
                            </Datagrid>
                        }
                    />
                </List>
                <Route path="/reviews/:id">
                    {({ match }) => {
                        const isMatch =
                            match &&
                            match.params &&
                            match.params.id !== 'create';
                        return (
                            <Drawer
                                variant="persistent"
                                open={isMatch}
                                anchor="right"
                                onClose={this.handleClose}
                            >
                                {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
                                {isMatch ? (
                                    <ReviewEdit
                                        id={match.params.id}
                                        onCancel={this.handleClose}
                                        {...props}
                                    />
                                ) : null}
                            </Drawer>
                        );
                    }}
                </Route>
            </Fragment>
        );
    }

    handleClose = () => {
        this.props.push('/reviews');
    };
}

export default withStyles(listStyles)(
    connect(
        undefined,
        { push }
    )(ReviewList)
);
