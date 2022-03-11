import * as React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { ReferenceField, TextField, useRecordContext } from 'react-admin';

import Basket from '../orders/Basket';
import { Customer, Invoice } from '../types';

const InvoiceShow = () => {
    const record = useRecordContext<Invoice>();
    if (!record) return null;
    return (
        <Card sx={{ width: 600, margin: 'auto' }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom>
                            Posters Galore
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom align="right">
                            Invoice {record.id}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} container alignContent="flex-end">
                        <ReferenceField
                            reference="customers"
                            source="customer_id"
                            link={false}
                        >
                            <CustomerField />
                        </ReferenceField>
                    </Grid>
                </Grid>
                <Box height={20}>&nbsp;</Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom align="center">
                            Date{' '}
                        </Typography>
                        <Typography gutterBottom align="center">
                            {new Date(record.date).toLocaleDateString()}
                        </Typography>
                    </Grid>

                    <Grid item xs={5}>
                        <Typography variant="h6" gutterBottom align="center">
                            Order
                        </Typography>
                        <ReferenceField
                            reference="commands"
                            source="command_id"
                            link={false}
                        >
                            <TextField
                                source="reference"
                                align="center"
                                component="p"
                                gutterBottom
                            />
                        </ReferenceField>
                    </Grid>
                </Grid>
                <Box margin="10px 0">
                    <ReferenceField
                        reference="commands"
                        source="command_id"
                        link={false}
                    >
                        <Basket />
                    </ReferenceField>
                </Box>
            </CardContent>
        </Card>
    );
};

const CustomerField = () => {
    const record = useRecordContext<Customer>();
    return record ? (
        <Typography>
            {record.first_name} {record.last_name}
            <br />
            {record.address}
            <br />
            {record.city}, {record.zipcode}
        </Typography>
    ) : null;
};

export default InvoiceShow;
