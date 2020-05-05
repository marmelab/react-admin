import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import {
    AutocompleteInput,
    BooleanField,
    Datagrid,
    DateField,
    DateInput,
    EditButton,
    Filter,
    List,
    NullableBooleanInput,
    NumberField,
    ReferenceInput,
    SearchInput,
    TextField,
    TextInput,
} from 'react-admin';
import {
    makeStyles,
    useMediaQuery,
    Divider,
    Tabs,
    Tab,
    Theme,
} from '@material-ui/core';

import NbItemsField from './NbItemsField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import MobileGrid from './MobileGrid';
import {
    Customer,
    FilterProps,
    OrderStatus,
    DatagridProps,
    Order,
    ListComponentProps,
} from '../types';
import { Identifier } from 'ra-core';

interface FilterParams {
    q?: string;
    customer_id?: string;
    date_gte?: string;
    date_lte?: string;
    total_gte?: string;
    returned?: boolean;
    status?: OrderStatus;
}

const OrderFilter: FC<FilterProps<FilterParams>> = props => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <ReferenceInput source="customer_id" reference="customers">
            <AutocompleteInput
                optionText={(choice: Customer) =>
                    choice.first_name && choice.last_name
                        ? `${choice.first_name} ${choice.last_name}`
                        : ''
                }
            />
        </ReferenceInput>
        <DateInput source="date_gte" />
        <DateInput source="date_lte" />
        <TextInput source="total_gte" />
        <NullableBooleanInput source="returned" />
    </Filter>
);

const useDatagridStyles = makeStyles({
    total: { fontWeight: 'bold' },
});

const tabs = [
    { id: 'ordered', name: 'ordered' },
    { id: 'delivered', name: 'delivered' },
    { id: 'cancelled', name: 'cancelled' },
];

interface TabbedDatagridProps extends DatagridProps<Order> {
    classes: ReturnType<typeof useDatagridStyles>;
    isXSmall: boolean;
}

const TabbedDatagrid: FC<TabbedDatagridProps> = ({
    ids,
    filterValues,
    isXSmall,
    classes,
    setFilters,
    displayedFilters,
    ...rest
}) => {
    const [ordered, setOrdered] = useState<Identifier[]>([]);
    const [delivered, setDelivered] = useState<Identifier[]>([]);
    const [cancelled, setCancelled] = useState<Identifier[]>([]);

    useEffect(() => {
        if (ids && ids !== filterValues.status) {
            switch (filterValues.status) {
                case 'ordered':
                    setOrdered(ids);
                    break;
                case 'delivered':
                    setDelivered(ids);
                    break;
                case 'cancelled':
                    setCancelled(ids);
                    break;
            }
        }
    }, [ids, filterValues.status]);

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

    const selectedIds =
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
                        label={choice.name}
                        value={choice.id}
                    />
                ))}
            </Tabs>
            <Divider />
            {isXSmall ? (
                <MobileGrid {...rest} ids={selectedIds} />
            ) : (
                <div>
                    {filterValues.status === 'ordered' && (
                        <Datagrid
                            {...rest}
                            ids={ordered}
                            optimized
                            rowClick="edit"
                        >
                            <DateField source="date" showTime />
                            <TextField source="reference" />
                            <CustomerReferenceField />
                            <NbItemsField />
                            <NumberField
                                source="total"
                                options={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                                className={classes.total}
                            />
                        </Datagrid>
                    )}
                    {filterValues.status === 'delivered' && (
                        <Datagrid {...rest} ids={delivered}>
                            <DateField source="date" showTime />
                            <TextField source="reference" />
                            <CustomerReferenceField />
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
                            <EditButton />
                        </Datagrid>
                    )}
                    {filterValues.status === 'cancelled' && (
                        <Datagrid {...rest} ids={cancelled}>
                            <DateField source="date" showTime />
                            <TextField source="reference" />
                            <CustomerReferenceField />
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
                            <EditButton />
                        </Datagrid>
                    )}
                </div>
            )}
        </Fragment>
    );
};

const StyledTabbedDatagrid: FC<DatagridProps<Order>> = props => {
    const classes = useDatagridStyles();
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('xs')
    );
    return <TabbedDatagrid classes={classes} isXSmall={isXSmall} {...props} />;
};

const OrderList: FC<ListComponentProps> = props => (
    <List
        {...props}
        filterDefaultValues={{ status: 'ordered' }}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
        filters={<OrderFilter />}
    >
        <StyledTabbedDatagrid />
    </List>
);

export default OrderList;
