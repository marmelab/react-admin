import * as React from 'react';
import { Fragment, useCallback } from 'react';
import {
    AutocompleteInput,
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    List,
    NullableBooleanInput,
    NumberField,
    ReferenceInput,
    ReferenceField,
    SearchInput,
    TextField,
    TextInput,
    useGetList,
    useListContext,
} from 'react-admin';
import {
    useMediaQuery,
    Divider,
    Tabs,
    Tab,
    Theme,
    Drawer,
} from '@mui/material';

import NbItemsField from '../orders/NbItemsField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import AddressField from '../visitors/AddressField';
import reviewFilters from './reviewFilters';
import MobileGrid from '../orders/MobileGrid';
import ReviewListDesktop from './ReviewListDesktop';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import ReviewListMobile from './ReviewListMobile';
import ReviewEdit from './ReviewEdit';

const TabbedReviewList = () => (
    <List
        filterDefaultValues={{ status: '' }}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
        filters={reviewFilters}
    >
        <TabbedList />
    </List>
);

const tabs = [
    { id: 'accepted', name: 'Accepted' },
    { id: 'pending', name: 'Pending' },
    { id: 'rejected', name: 'Rejected' },
];

const useGetTotals = (filterValues: any) => {
    const { total: totalOrdered } = useGetList('commands', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'date', order: 'DESC' },
        filter: { ...filterValues, status: 'accepted' },
    });
    const { total: totalDelivered } = useGetList('commands', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'date', order: 'DESC' },
        filter: { ...filterValues, status: 'pending' },
    });
    const { total: totalCancelled } = useGetList('commands', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'date', order: 'DESC' },
        filter: { ...filterValues, status: 'rejected' },
    });

    return {
        ordered: totalOrdered,
        delivered: totalDelivered,
        cancelled: totalCancelled,
    };
};

const TabbedList = () => {
    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const totals = useGetTotals(filterValues) as any;

    const location = useLocation();
    const navigate = useNavigate();

    const handleChange = useCallback(
        (event: React.ChangeEvent<{}>, value: any) => {
            setFilters &&
                setFilters(
                    { ...filterValues, status: value },
                    displayedFilters,
                    false // no debounce, we want the filter to fire immediately
                );
        },
        [displayedFilters, filterValues, setFilters]
    );

    const handleClose = useCallback(() => {
        navigate('/reviews');
    }, [navigate]);

    const match = matchPath('/reviews/:id', location.pathname);
    console.log('listContext =>', listContext);
    return (
        <Fragment>
            <Tabs
                variant="fullWidth"
                centered
                value={filterValues.status}
                indicatorColor="primary"
                onChange={handleChange}
            >
                {tabs.map(choice => (
                    <Tab
                        key={choice.id}
                        label={
                            totals[choice.name]
                                ? `${choice.name} (${totals[choice.name]})`
                                : choice.name
                        }
                        value={choice.id}
                    />
                ))}
            </Tabs>
            <Divider />
            {isXSmall ? (
                <MobileGrid />
            ) : (
                <>
                    {filterValues.status === 'accepted' && (
                        <ReviewListDesktop
                            selectedRow={
                                !!match
                                    ? parseInt((match as any).params.id, 10)
                                    : undefined
                            }
                        />
                    )}
                    {filterValues.status === 'pending' && (
                        <ReviewListDesktop
                            selectedRow={
                                !!match
                                    ? parseInt((match as any).params.id, 10)
                                    : undefined
                            }
                        />
                    )}
                    {filterValues.status === 'rejected' && (
                        <ReviewListDesktop
                            selectedRow={
                                !!match
                                    ? parseInt((match as any).params.id, 10)
                                    : undefined
                            }
                        />
                    )}
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
                </>
            )}
        </Fragment>
    );
};

export default TabbedReviewList;
