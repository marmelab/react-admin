import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Fragment, useCallback } from 'react';
import classnames from 'classnames';
import { BulkDeleteButton, List, BulkActionProps } from 'react-admin';
import { Route, RouteChildrenProps, useHistory } from 'react-router-dom';
import { Drawer, useMediaQuery, Theme } from '@mui/material';

import BulkAcceptButton from './BulkAcceptButton';
import BulkRejectButton from './BulkRejectButton';
import ReviewListMobile from './ReviewListMobile';
import ReviewListDesktop from './ReviewListDesktop';
import reviewFilters from './reviewFilters';
import ReviewEdit from './ReviewEdit';

const PREFIX = 'ReviewList';

const classes = {
    root: `${PREFIX}-root`,
    list: `${PREFIX}-list`,
    listWithDrawer: `${PREFIX}-listWithDrawer`,
    drawerPaper: `${PREFIX}-drawerPaper`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        display: 'flex',
    },

    [`& .${classes.list}`]: {
        flexGrow: 1,
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },

    [`& .${classes.listWithDrawer}`]: {
        marginRight: 400,
    },

    [`& .${classes.drawerPaper}`]: {
        zIndex: 100,
    },
}));

const ReviewsBulkActionButtons = (props: BulkActionProps) => (
    <Fragment>
        <BulkAcceptButton {...props} />
        <BulkRejectButton {...props} />
        <BulkDeleteButton {...props} />
    </Fragment>
);

const ReviewList = () => {
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const history = useHistory();

    const handleClose = useCallback(() => {
        history.push('/reviews');
    }, [history]);

    return (
        <Root className={classes.root}>
            <Route path="/reviews/:id">
                {({ match }: RouteChildrenProps<{ id: string }>) => {
                    const isMatch = !!(
                        match &&
                        match.params &&
                        match.params.id !== 'create'
                    );

                    return (
                        <Fragment>
                            <List
                                className={classnames(classes.list, {
                                    [classes.listWithDrawer]: isMatch,
                                })}
                                bulkActionButtons={<ReviewsBulkActionButtons />}
                                filters={reviewFilters}
                                perPage={25}
                                sort={{ field: 'date', order: 'DESC' }}
                            >
                                {isXSmall ? (
                                    <ReviewListMobile />
                                ) : (
                                    <ReviewListDesktop
                                        selectedRow={
                                            isMatch
                                                ? parseInt(
                                                      (match as any).params.id,
                                                      10
                                                  )
                                                : undefined
                                        }
                                    />
                                )}
                            </List>
                            <Drawer
                                variant="persistent"
                                open={isMatch}
                                anchor="right"
                                onClose={handleClose}
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                            >
                                {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
                                {isMatch ? (
                                    <ReviewEdit
                                        id={(match as any).params.id}
                                        onCancel={handleClose}
                                    />
                                ) : null}
                            </Drawer>
                        </Fragment>
                    );
                }}
            </Route>
        </Root>
    );
};

export default ReviewList;
