import * as React from 'react';
import {
    List,
    ColumnsButton,
    DateField,
    ReferenceField,
    DateInput,
    TopToolbar,
    ExportButton,
    ReferenceInput,
    FilterButton,
    useDefaultTitle,
    useListContext,
    DataTable,
} from 'react-admin';

import { type Invoice } from '../types';
import FullNameField from '../visitors/FullNameField';
import AddressField from '../visitors/AddressField';
import InvoiceShow from './InvoiceShow';

const listFilters = [
    <DateInput source="date_gte" alwaysOn />,
    <DateInput source="date_lte" alwaysOn />,
    <ReferenceInput source="customer_id" reference="customers" />,
    <ReferenceInput source="order_id" reference="orders" />,
];

const ListActions = () => (
    <TopToolbar>
        <FilterButton />
        <ColumnsButton />
        <ExportButton />
    </TopToolbar>
);

const InvoicesTitle = () => {
    const title = useDefaultTitle();
    const { defaultTitle } = useListContext();
    return (
        <>
            <title>{`${title} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const Column = DataTable.Col<Invoice>;
const ColumnNumber = DataTable.NumberCol<Invoice>;

const InvoiceList = () => (
    <List
        filters={listFilters}
        perPage={25}
        sort={{ field: 'date', order: 'DESC' }}
        actions={<ListActions />}
        title={<InvoicesTitle />}
    >
        <DataTable
            rowClick="expand"
            expand={<InvoiceShow />}
            sx={{
                '& .onlyLarge': {
                    display: { xs: 'none', lg: 'table-cell' },
                },
            }}
        >
            <Column source="id" />
            <Column field={DateField} source="date" />
            <Column source="customer_id" className="onlyLarge">
                <ReferenceField source="customer_id" reference="customers">
                    <FullNameField source="last_name" />
                </ReferenceField>
            </Column>
            <Column
                source="address"
                disableSort
                label="resources.invoices.fields.address"
            >
                <ReferenceField
                    source="customer_id"
                    reference="customers"
                    link={false}
                >
                    <AddressField />
                </ReferenceField>
            </Column>
            <Column source="order_id">
                <ReferenceField source="order_id" reference="orders" />
            </Column>
            <ColumnNumber source="total_ex_taxes" className="onlyLarge" />
            <ColumnNumber source="delivery_fees" className="onlyLarge" />
            <ColumnNumber source="taxes" className="onlyLarge" />
            <ColumnNumber source="total" />
        </DataTable>
    </List>
);

export default InvoiceList;
