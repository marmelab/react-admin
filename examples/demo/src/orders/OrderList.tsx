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
import { useMediaQuery, Divider, Tabs, Tab, Theme } from '@mui/material';

import NbItemsField from './NbItemsField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import AddressField from '../visitors/AddressField';
import MobileGrid from './MobileGrid';
import { Customer } from '../types';

const OrderList = () => (
    <List
        filterDefaultValues={{ status: 'ordered' }}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
        filters={orderFilters}
    >
        <TabbedDatagrid />
    </List>
);

const orderFilters = [
    <SearchInput source="q" alwaysOn />,
    <ReferenceInput source="customer_id" reference="customers">
        <AutocompleteInput
            optionText={(choice?: Customer) =>
                choice?.id // the empty choice is { id: '' }
                    ? `${choice.first_name} ${choice.last_name}`
                    : ''
            }
        />
    </ReferenceInput>,
    <DateInput source="date_gte" />,
    <DateInput source="date_lte" />,
    <TextInput source="total_gte" />,
    <NullableBooleanInput source="returned" />,
];

const tabs = [
    { id: 'ordered', name: 'ordered' },
    { id: 'delivered', name: 'delivered' },
    { id: 'cancelled', name: 'cancelled' },
];

const useGetTotals = (filterValues: any) => {
    const { total: totalOrdered } = useGetList('commands', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'ordered' },
    });
    const { total: totalDelivered } = useGetList('commands', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'delivered' },
    });
    const { total: totalCancelled } = useGetList('commands', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: { ...filterValues, status: 'cancelled' },
    });

    return {
        ordered: totalOrdered,
        delivered: totalDelivered,
        cancelled: totalCancelled,
    };
};

const TabbedDatagrid = () => {
    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const totals = useGetTotals(filterValues) as any;

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
                    {filterValues.status === 'ordered' && (
                        <Datagrid optimized rowClick="edit">
                            <DateField source="date" showTime />
                            <TextField source="reference" />
                            <CustomerReferenceField />
                            <ReferenceField
                                source="customer_id"
                                reference="customers"
                                link={false}
                                label="resources.commands.fields.address"
                            >
                                <AddressField />
                            </ReferenceField>
                            <NbItemsField />
                            <NumberField
                                source="total"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Datagrid>
                    )}
                    {filterValues.status === 'delivered' && (
                        <Datagrid rowClick="edit">
                            <DateField source="date" showTime />
                            <TextField source="reference" />
                            <CustomerReferenceField />
                            <ReferenceField
                                source="customer_id"
                                reference="customers"
                                link={false}
                                label="resources.commands.fields.address"
                            >
                                <AddressField />
                            </ReferenceField>
                            <NbItemsField />
                            <NumberField
                                source="total"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                                sx={{ fontWeight: 'bold' }}
                            />
                            <BooleanField
                                source="returned"
                                sx={{ mt: -0.5, mb: -0.5 }}
                            />
                        </Datagrid>
                    )}
                    {filterValues.status === 'cancelled' && (
                        <Datagrid rowClick="edit">
                            <DateField source="date" showTime />
                            <TextField source="reference" />
                            <CustomerReferenceField />
                            <ReferenceField
                                source="customer_id"
                                reference="customers"
                                link={false}
                                label="resources.commands.fields.address"
                            >
                                <AddressField />
                            </ReferenceField>
                            <NbItemsField />
                            <NumberField
                                source="total"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                                sx={{ fontWeight: 'bold' }}
                            />
                            <BooleanField
                                source="returned"
                                sx={{ mt: -0.5, mb: -0.5 }}
                            />
                        </Datagrid>
                    )}
                </>
            )}
        </Fragment>
    );
};

export default OrderList;
