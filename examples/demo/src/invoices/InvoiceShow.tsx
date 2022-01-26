import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ReferenceField, TextField, useRecordContext } from 'react-admin';

import Basket from '../orders/Basket';
import { Customer, Invoice } from '../types';

const PREFIX = 'InvoiceShow';

const classes = {
    root: `${PREFIX}-root`,
    spacer: `${PREFIX}-spacer`,
    invoices: `${PREFIX}-invoices`,
};

const StyledCard = styled(Card)({
    [`&.${classes.root}`]: { width: 600, margin: 'auto' },
    [`& .${classes.spacer}`]: { height: 20 },
    [`& .${classes.invoices}`]: { margin: '10px 0' },
});

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
const InvoiceShow = () => {
    const record = useRecordContext<Invoice>();

    if (!record) return null;
    return (
        <StyledCard className={classes.root}>
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
                            resource="invoices"
                            reference="customers"
                            source="customer_id"
                            record={record}
                            link={false}
                        >
                            <CustomerField />
                        </ReferenceField>
                    </Grid>
                </Grid>
                <div className={classes.spacer}>&nbsp;</div>
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
                <div className={classes.invoices}>
                    <ReferenceField
                        resource="invoices"
                        reference="commands"
                        source="command_id"
                        record={record}
                        link={false}
                    >
                        <Basket />
                    </ReferenceField>
                </div>
            </CardContent>
        </StyledCard>
    );
};

export default InvoiceShow;
