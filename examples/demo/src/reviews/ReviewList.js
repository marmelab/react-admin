import React, { Fragment, Component } from 'react';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { BulkDeleteButton, List, Responsive } from 'react-admin';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Route } from 'react-router';
import Drawer from '@material-ui/core/Drawer';
import { createStyles, withStyles } from '@material-ui/core/styles';
import BulkAcceptButton from './BulkAcceptButton';
import BulkRejectButton from './BulkRejectButton';
import ReviewListMobile from './ReviewListMobile';
import ReviewListDesktop from './ReviewListDesktop';
import ReviewFilter from './ReviewFilter';
import ReviewEdit from './ReviewEdit';

const ReviewsBulkActionButtons = props => (
    <Fragment>
        <BulkAcceptButton {...props} />
        <BulkRejectButton {...props} />
        <BulkDeleteButton {...props} />
    </Fragment>
);

const styles = theme => createStyles({
    root: {
        display: 'flex',
    },
    list: {
        flexGrow: 1,
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
    listWithDrawer: {
        marginRight: 400,
    },
});

class ReviewList extends Component {
    render() {
        const { classes, ...props } = this.props;
        return (
            <div className={classes.root}>
                <Route path="/reviews/:id">
                    {({ match }) => {
                        const isMatch =
                            !!(match &&
                            match.params &&
                            match.params.id !== 'create');

                        return (
                            <Fragment>
                                <List
                                    {...props}
                                    className={classnames(classes.list, {
                                        [classes.listWithDrawer]: isMatch
                                    })}
                                    bulkActionButtons={<ReviewsBulkActionButtons />}
                                    filters={<ReviewFilter />}
                                    perPage={25}
                                    sort={{ field: 'date', order: 'DESC' }}
                                >
                                    <Responsive
                                        xsmall={<ReviewListMobile />}
                                        medium={<ReviewListDesktop />}
                                    />
                                </List>
                                <Drawer
                                    variant="persistent"
                                    open={isMatch}
                                    anchor="right"
                                    onClose={this.handleClose}
                                    classes={{
                                        paper: classes.drawerPaper
                                    }}
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
                            </Fragment>
                        );
                    }}
                </Route>
            </div>
        );
    }

    handleClose = () => {
        this.props.push('/reviews');
    };
}

export default compose(
    connect(undefined, { push }),
    withStyles(styles)
)(ReviewList);
