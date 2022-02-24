import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    ReferenceField,
    NumberField,
    DateInput,
} from 'react-admin';

import FullNameField from '../visitors/FullNameField';
import AddressField from '../visitors/AddressField';
import InvoiceShow from './InvoiceShow';

const PREFIX = 'InvoiceList';

const classes = {
    hiddenOnSmallScreens: `${PREFIX}-hiddenOnSmallScreens`,
};

const StyledList = styled(List)(({ theme }) => ({
    [`& .${classes.hiddenOnSmallScreens}`]: {
        display: 'table-cell',
        [theme.breakpoints.down('lg')]: {
            display: 'none',
        },
    },
}));

const listFilters = [
    <DateInput source="date_gte" alwaysOn />,
    <DateInput source="date_lte" alwaysOn />,
];

const InvoiceList = () => {
    return (
        <StyledList
            filters={listFilters}
            perPage={25}
            sort={{ field: 'date', order: 'desc' }}
        >
            <Datagrid rowClick="expand" expand={<InvoiceShow />}>
                <TextField source="id" />
                <DateField source="date" />
                <ReferenceField source="customer_id" reference="customers">
                    <FullNameField />
                </ReferenceField>
                <ReferenceField
                    source="customer_id"
                    reference="customers"
                    link={false}
                    label="resources.invoices.fields.address"
                    cellClassName={classes.hiddenOnSmallScreens}
                    headerClassName={classes.hiddenOnSmallScreens}
                >
                    <AddressField />
                </ReferenceField>
                <ReferenceField source="command_id" reference="commands">
                    <TextField source="reference" />
                </ReferenceField>
                <NumberField source="total_ex_taxes" />
                <NumberField source="delivery_fees" />
                <NumberField source="taxes" />
                <NumberField source="total" />
            </Datagrid>
        </StyledList>
    );
};

export default InvoiceList;
