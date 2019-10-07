import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useShowController, ReferenceField, TextField } from 'react-admin';

import Basket from '../orders/Basket';

const CustomerField = ({ record }) => (
    <Typography>
        {record.first_name} {record.last_name}
        <br />
        {record.address}
        <br />
        {record.city}, {record.zipcode}
    </Typography>
);

const InvoiceShow = props => {
    const { record } = useShowController(props);
    if (!record) return null;
    return (
        <Card style={{ width: 600, margin: 'auto' }}>
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
                    <Grid item xs={12} align="right">
                        <ReferenceField
                            resource="invoices"
                            reference="customers"
                            source="customer_id"
                            basePath="/invoices"
                            record={record}
                            link={false}
                        >
                            <CustomerField />
                        </ReferenceField>
                    </Grid>
                </Grid>
                <div style={{ height: 20 }}>&nbsp;</div>
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
                            resource="invoices"
                            reference="commands"
                            source="command_id"
                            basePath="/invoices"
                            record={record}
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
                <div style={{ margin: '10px 0' }}>
                    <ReferenceField
                        resource="invoices"
                        reference="commands"
                        source="command_id"
                        basePath="/invoices"
                        record={record}
                        link={false}
                    >
                        <Basket />
                    </ReferenceField>
                </div>
            </CardContent>
        </Card>
    );
};

export default InvoiceShow;
