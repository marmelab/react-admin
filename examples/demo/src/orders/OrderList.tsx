import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Fragment, useCallback, useEffect, useState } from 'react';
import {
    AutocompleteInput,
    BooleanField,
    Datagrid,
    DatagridProps,
    DateField,
    DateInput,
    Record,
    List,
    ListContextProvider,
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

const PREFIX = 'OrderList';

const classes = {
    total: `${PREFIX}-total`,
};

const StyledDatagrid = styled(Datagrid)({
    [`& .${classes.total}`]: { fontWeight: 'bold' },
});

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

interface TabbedDatagridProps extends DatagridProps {}

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

const TabbedDatagrid = (props: TabbedDatagridProps) => {
    const listContext = useListContext();
    const {
        data,
        filterValues,
        setFilters,
        displayedFilters,
        isFetching,
    } = listContext;
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const [ordered, setOrdered] = useState<Record[]>([]);
    const [delivered, setDelivered] = useState<Record[]>([]);
    const [cancelled, setCancelled] = useState<Record[]>([]);
    const totals = useGetTotals(filterValues) as any;

    useEffect(() => {
        if (isFetching) {
            return;
        }
        switch (filterValues.status) {
            case 'ordered':
                setOrdered(data);
                break;
            case 'delivered':
                setDelivered(data);
                break;
            case 'cancelled':
                setCancelled(data);
                break;
        }
    }, [data, isFetching, filterValues.status]);

    const handleChange = useCallback(
        (event: React.ChangeEvent<{}>, value: any) => {
            setFilters &&
                setFilters(
                    { ...filterValues, status: value },
                    displayedFilters
                );
        },
        [displayedFilters, filterValues, setFilters]
    );

    const selectedData =
        filterValues.status === 'ordered'
            ? ordered
            : filterValues.status === 'delivered'
            ? delivered
            : cancelled;

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
                <ListContextProvider
                    value={{ ...listContext, data: selectedData }}
                >
                    <MobileGrid {...props} data={selectedData} />
                </ListContextProvider>
            ) : (
                <div>
                    {filterValues.status === 'ordered' && (
                        <ListContextProvider
                            value={{ ...listContext, ids: ordered }}
                        >
                            <StyledDatagrid
                                {...props}
                                optimized
                                rowClick="edit"
                            >
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
                                    className={classes.total}
                                />
                            </StyledDatagrid>
                        </ListContextProvider>
                    )}
                    {filterValues.status === 'delivered' && (
                        <ListContextProvider
                            value={{ ...listContext, ids: delivered }}
                        >
                            <StyledDatagrid {...props} rowClick="edit">
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
                                    className={classes.total}
                                />
                                <BooleanField source="returned" />
                            </StyledDatagrid>
                        </ListContextProvider>
                    )}
                    {filterValues.status === 'cancelled' && (
                        <ListContextProvider
                            value={{ ...listContext, ids: cancelled }}
                        >
                            <StyledDatagrid {...props} rowClick="edit">
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
                                    className={classes.total}
                                />
                                <BooleanField source="returned" />
                            </StyledDatagrid>
                        </ListContextProvider>
                    )}
                </div>
            )}
        </Fragment>
    );
};

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

export default OrderList;
