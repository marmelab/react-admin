import * as React from 'react';
import {
    List,
    DatagridConfigurable,
    TextField,
    DateField,
    ReferenceField,
    NumberField,
    DateInput,
    TopToolbar,
    ExportButton,
    SelectColumnsButton,
    ReferenceInput,
    FilterButton,
    useDefaultTitle,
    useListContext,
} from 'react-admin';

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
        <SelectColumnsButton />
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

const InvoiceList = () => (
    <List
        filters={listFilters}
        perPage={25}
        sort={{ field: 'date', order: 'DESC' }}
        actions={<ListActions />}
        title={<InvoicesTitle />}
    >
        <DatagridConfigurable
            rowClick="expand"
            expand={<InvoiceShow />}
            sx={{
                '& .column-customer_id': {
                    display: { xs: 'none', md: 'table-cell' },
                },
                '& .column-total_ex_taxes': {
                    display: { xs: 'none', md: 'table-cell' },
                },
                '& .column-delivery_fees': {
                    display: { xs: 'none', md: 'table-cell' },
                },
                '& .column-taxes': {
                    display: { xs: 'none', md: 'table-cell' },
                },
            }}
        >
            <TextField source="id" />
            <DateField source="date" />
            <ReferenceField source="customer_id" reference="customers">
                <FullNameField source="last_name" />
            </ReferenceField>
            <ReferenceField
                source="customer_id"
                reference="customers"
                link={false}
                label="resources.invoices.fields.address"
            >
                <AddressField />
            </ReferenceField>
            <ReferenceField source="order_id" reference="orders">
                <TextField source="reference" />
            </ReferenceField>
            <NumberField source="total_ex_taxes" />
            <NumberField source="delivery_fees" />
            <NumberField source="taxes" />
            <NumberField source="total" />
        </DatagridConfigurable>
    </List>
);

export default InvoiceList;
