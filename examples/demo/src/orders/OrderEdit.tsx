import * as React from 'react';
import {
    BooleanInput,
    DateField,
    Edit,
    Form,
    Labeled,
    Link as RaLink,
    PrevNextButtons,
    ReferenceField,
    SelectInput,
    TextField,
    Toolbar,
    useRecordContext,
    useTranslate,
    useDefaultTitle,
    useEditContext,
} from 'react-admin';
import { Card, CardContent, Box, Grid, Typography, Link } from '@mui/material';

import { Customer } from '../types';
import Basket from './Basket';
import Totals from './Totals';

const OrderEdit = () => (
    <Edit title={<OrderTitle />} component="div">
        <OrderForm />
    </Edit>
);

const OrderTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useEditContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const CustomerDetails = () => {
    const record = useRecordContext<Customer>();
    return (
        <Typography>
            <RaLink to={`/customers/${record?.id}`}>
                {record?.first_name} {record?.last_name}
            </RaLink>
            <br />
            <Link href={`mailto:${record?.email}`}>{record?.email}</Link>
        </Typography>
    );
};

const CustomerAddress = () => {
    const record = useRecordContext<Customer>();
    return (
        <div>
            <Typography>
                {record?.first_name} {record?.last_name}
            </Typography>
            <Typography>{record?.address}</Typography>
            <Typography>
                {record?.city}, {record?.stateAbbr} {record?.zipcode}
            </Typography>
        </div>
    );
};

const Spacer = () => <Box mb={1}>&nbsp;</Box>;

const OrderForm = () => {
    const translate = useTranslate();
    return (
        <Form>
            <Box maxWidth="50em">
                <PrevNextButtons
                    filterDefaultValues={{ status: 'ordered' }}
                    sort={{ field: 'date', order: 'DESC' }}
                />
                <Card>
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.orders.section.order'
                                    )}
                                </Typography>
                                <Grid container>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Labeled source="date">
                                            <DateField source="date" />
                                        </Labeled>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Labeled source="reference">
                                            <TextField source="reference" />
                                        </Labeled>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <SelectInput
                                            source="status"
                                            choices={[
                                                {
                                                    id: 'delivered',
                                                    name: 'delivered',
                                                },
                                                {
                                                    id: 'ordered',
                                                    name: 'ordered',
                                                },
                                                {
                                                    id: 'cancelled',
                                                    name: 'cancelled',
                                                },
                                                {
                                                    id: 'unknown',
                                                    name: 'unknown',
                                                    disabled: true,
                                                },
                                            ]}
                                            sx={{ width: '80%' }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Box mt={2}>
                                            <BooleanInput
                                                row={true}
                                                source="returned"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.orders.section.customer'
                                    )}
                                </Typography>
                                <ReferenceField
                                    source="customer_id"
                                    reference="customers"
                                    link={false}
                                >
                                    <CustomerDetails />
                                </ReferenceField>
                                <Spacer />

                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.orders.section.shipping_address'
                                    )}
                                </Typography>
                                <ReferenceField
                                    source="customer_id"
                                    reference="customers"
                                    link={false}
                                >
                                    <CustomerAddress />
                                </ReferenceField>
                            </Grid>
                        </Grid>
                        <Spacer />

                        <Typography variant="h6" gutterBottom>
                            {translate('resources.orders.section.items')}
                        </Typography>
                        <div>
                            <Basket />
                        </div>
                        <Spacer />

                        <Typography variant="h6" gutterBottom>
                            {translate('resources.orders.section.total')}
                        </Typography>
                        <div>
                            <Totals />
                        </div>
                    </CardContent>
                    <Toolbar />
                </Card>
            </Box>
        </Form>
    );
};

export default OrderEdit;
