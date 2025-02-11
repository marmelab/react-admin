import * as React from 'react';
import { useCallback } from 'react';
import {
    CreateButton,
    ExportButton,
    FilterButton,
    List,
    SelectColumnsButton,
    TopToolbar,
    useDefaultTitle,
    useListContext,
} from 'react-admin';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Box, Drawer, useMediaQuery, Theme } from '@mui/material';

import ReviewListMobile from './ReviewListMobile';
import ReviewListDesktop from './ReviewListDesktop';
import reviewFilters from './reviewFilters';
import ReviewEdit from './ReviewEdit';

const ReviewListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
        <SelectColumnsButton />
        <ExportButton />
    </TopToolbar>
);

const ReviewsTitle = () => {
    const title = useDefaultTitle();
    const { defaultTitle } = useListContext();
    return (
        <>
            <title>{`${title} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

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
        <Box display="flex">
            <List
                sx={{
                    flexGrow: 1,
                    transition: (theme: any) =>
                        theme.transitions.create(['all'], {
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    marginRight: !!match ? '400px' : 0,
                }}
                filters={reviewFilters}
                perPage={25}
                sort={{ field: 'date', order: 'DESC' }}
                actions={<ReviewListActions />}
                title={<ReviewsTitle />}
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
                sx={{ zIndex: 100 }}
            >
                {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
                {!!match && (
                    <ReviewEdit
                        id={(match as any).params.id}
                        onCancel={handleClose}
                    />
                )}
            </Drawer>
        </Box>
    );
};

export default ReviewList;
