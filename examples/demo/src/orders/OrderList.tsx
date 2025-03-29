import * as React from 'react';
import { Fragment, useCallback } from 'react';
import {
    AutocompleteInput,
    BooleanField,
    Count,
    DataTable,
    DateField,
    DateInput,
    ExportButton,
    FilterButton,
    List,
    NullableBooleanInput,
    NumberInput,
    ReferenceField,
    ReferenceInput,
    SearchInput,
    ColumnsButton,
    TopToolbar,
    useDefaultTitle,
    useListContext,
} from 'react-admin';
import { useMediaQuery, Divider, Tabs, Tab, Theme } from '@mui/material';

import CustomerReferenceField from '../visitors/CustomerReferenceField';
import AddressField from '../visitors/AddressField';
import MobileGrid from './MobileGrid';
import { Customer } from '../types';

const storeKeyByStatus = {
    ordered: 'orders.list1',
    delivered: 'orders.list2',
    cancelled: 'orders.list3',
};

const ListActions = () => {
    const { filterValues } = useListContext();
    const status =
        (filterValues.status as 'ordered' | 'delivered' | 'cancelled') ??
        'ordered';
    return (
        <TopToolbar>
            <FilterButton />
            <ColumnsButton storeKey={storeKeyByStatus[status]} />
            <ExportButton />
        </TopToolbar>
    );
};

const OrdersTitle = () => {
    const title = useDefaultTitle();
    const { defaultTitle } = useListContext();
    return (
        <>
            <title>{`${title} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const OrderList = () => (
    <List
        filterDefaultValues={{ status: 'ordered' }}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
        filters={orderFilters}
        actions={<ListActions />}
        title={<OrdersTitle />}
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
            sx={{ minWidth: 200 }}
        />
    </ReferenceInput>,
    <DateInput source="date_gte" parse={d => new Date(d).toISOString()} />,
    <DateInput source="date_lte" parse={d => new Date(d).toISOString()} />,
    <NumberInput source="total_gte" />,
    <NullableBooleanInput source="returned" />,
];

const tabs = [
    { id: 'ordered', name: 'ordered' },
    { id: 'delivered', name: 'delivered' },
    { id: 'cancelled', name: 'cancelled' },
];

const TabbedDatagrid = () => {
    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );

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

    return (
        <Fragment>
            <Tabs
                variant="fullWidth"
                centered
                value={filterValues.status ?? 'ordered'}
                indicatorColor="primary"
                onChange={handleChange}
            >
                {tabs.map(choice => (
                    <Tab
                        key={choice.id}
                        label={
                            <span>
                                {choice.name} (
                                <Count
                                    filter={{
                                        ...filterValues,
                                        status: choice.name,
                                    }}
                                    sx={{ lineHeight: 'inherit' }}
                                />
                                )
                            </span>
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
                    {(filterValues.status == null ||
                        filterValues.status === 'ordered') && (
                        <DataTable
                            rowClick="edit"
                            hiddenColumns={[
                                'total_ex_taxes',
                                'delivery_fees',
                                'taxes',
                            ]}
                            storeKey={storeKeyByStatus.ordered}
                        >
                            <DataTable.Col source="date">
                                <DateField source="date" showTime />
                            </DataTable.Col>
                            <DataTable.Col source="reference" />
                            <DataTable.Col
                                source="customer_id"
                                field={CustomerReferenceField}
                            />
                            <DataTable.Col label="resources.orders.fields.address">
                                <ReferenceField
                                    source="customer_id"
                                    reference="customers"
                                    link={false}
                                >
                                    <AddressField />
                                </ReferenceField>
                            </DataTable.Col>
                            <DataTable.NumberCol
                                source="basket.length"
                                label="resources.orders.fields.nb_items"
                            />
                            <DataTable.NumberCol
                                source="total_ex_taxes"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                            />
                            <DataTable.NumberCol
                                source="delivery_fees"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                            />
                            <DataTable.NumberCol
                                source="taxes"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                            />
                            <DataTable.NumberCol
                                source="total"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </DataTable>
                    )}
                    {filterValues.status === 'delivered' && (
                        <DataTable
                            rowClick="edit"
                            hiddenColumns={[
                                'total_ex_taxes',
                                'delivery_fees',
                                'taxes',
                            ]}
                            storeKey={storeKeyByStatus.delivered}
                        >
                            <DataTable.Col source="date">
                                <DateField source="date" showTime />
                            </DataTable.Col>
                            <DataTable.Col source="reference" />
                            <DataTable.Col
                                source="customer_id"
                                field={CustomerReferenceField}
                            />
                            <DataTable.Col label="resources.orders.fields.address">
                                <ReferenceField
                                    source="customer_id"
                                    reference="customers"
                                    link={false}
                                >
                                    <AddressField />
                                </ReferenceField>
                            </DataTable.Col>
                            <DataTable.NumberCol
                                source="basket.length"
                                label="resources.orders.fields.nb_items"
                            />
                            <DataTable.NumberCol
                                source="total_ex_taxes"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                            />
                            <DataTable.NumberCol
                                source="delivery_fees"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                            />
                            <DataTable.NumberCol
                                source="taxes"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                            />
                            <DataTable.NumberCol
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
                        </DataTable>
                    )}
                    {filterValues.status === 'cancelled' && (
                        <DataTable
                            rowClick="edit"
                            hiddenColumns={[
                                'total_ex_taxes',
                                'delivery_fees',
                                'taxes',
                            ]}
                            storeKey={storeKeyByStatus.cancelled}
                        >
                            <DataTable.Col source="date">
                                <DateField source="date" showTime />
                            </DataTable.Col>
                            <DataTable.Col source="reference" />
                            <DataTable.Col
                                source="customer_id"
                                field={CustomerReferenceField}
                            />
                            <DataTable.Col label="resources.orders.fields.address">
                                <ReferenceField
                                    source="customer_id"
                                    reference="customers"
                                    link={false}
                                >
                                    <AddressField />
                                </ReferenceField>
                            </DataTable.Col>
                            <DataTable.NumberCol
                                source="basket.length"
                                label="resources.orders.fields.nb_items"
                            />
                            <DataTable.NumberCol
                                source="total_ex_taxes"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                            />
                            <DataTable.NumberCol
                                source="delivery_fees"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                            />
                            <DataTable.NumberCol
                                source="taxes"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                            />
                            <DataTable.NumberCol
                                source="total"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </DataTable>
                    )}
                </>
            )}
        </Fragment>
    );
};

export default OrderList;
