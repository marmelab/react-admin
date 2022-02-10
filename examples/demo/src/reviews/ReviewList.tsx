import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Fragment, useCallback } from 'react';
import clsx from 'clsx';
import { BulkDeleteButton, List, BulkActionProps } from 'react-admin';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
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
    const location = useLocation();
    const navigate = useNavigate();

    const handleClose = useCallback(() => {
        navigate('/reviews');
    }, [navigate]);

    const match = matchPath('/reviews/:id', location.pathname);

    return (
        <Root className={classes.root}>
            <Fragment>
                <List
                    className={clsx(classes.list, {
                        [classes.listWithDrawer]: !!match,
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
                                !!match
                                    ? parseInt((match as any).params.id, 10)
                                    : undefined
                            }
                        />
                    )}
                </List>
                <Drawer
                    variant="persistent"
                    open={!!match}
                    anchor="right"
                    onClose={handleClose}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
                    {!!match ? (
                        <ReviewEdit
                            id={(match as any).params.id}
                            onCancel={handleClose}
                        />
                    ) : null}
                </Drawer>
            </Fragment>
        </Root>
    );
};

export default ReviewList;
