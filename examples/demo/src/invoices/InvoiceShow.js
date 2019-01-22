import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ShowController, ReferenceField, TextField } from 'react-admin';

import Basket from '../commands/Basket';

const CustomerField = ({ record }) => (
    <Typography>
        {record.first_name} {record.last_name}
        <br />
        {record.address}
        <br />
        {record.city}, {record.zipcode}
    </Typography>
);

const InvoiceShow = props => (
    <ShowController {...props} title=" ">
        {({ record }) =>
            record && (
                <Card style={{ width: 600, margin: 'auto' }}>
                    <CardContent>
                        <Grid container spacing={16}>
                            <Grid item xs={6}>
                                <Typography variant="title" gutterBottom>
                                    Posters Galore
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="title"
                                    gutterBottom
                                    align="right"
                                >
                                    Invoice {record.id}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16}>
                            <Grid item xs={12} align="right">
                                <ReferenceField
                                    resource="invoices"
                                    reference="customers"
                                    source="customer_id"
                                    basePath="/invoices"
                                    record={record}
                                    linkType={false}
                                >
                                    <CustomerField />
                                </ReferenceField>
                            </Grid>
                        </Grid>
                        <div style={{ height: 20 }}>&nbsp;</div>
                        <Grid container spacing={16}>
                            <Grid item xs={6}>
                                <Typography
                                    variant="title"
                                    gutterBottom
                                    align="center"
                                >
                                    Date{' '}
                                </Typography>
                                <Typography gutterBottom align="center">
                                    {new Date(record.date).toLocaleDateString()}
                                </Typography>
                            </Grid>

                            <Grid item xs={5}>
                                <Typography
                                    variant="title"
                                    gutterBottom
                                    align="center"
                                >
                                    Order
                                </Typography>
                                <Typography gutterBottom align="center">
                                    <ReferenceField
                                        resource="invoices"
                                        reference="commands"
                                        source="command_id"
                                        basePath="/invoices"
                                        record={record}
                                        linkType={false}
                                    >
                                        <TextField source="reference" />
                                    </ReferenceField>
                                </Typography>
                            </Grid>
                        </Grid>
                        <div style={{ margin: '10px 0' }}>
                            <ReferenceField
                                resource="invoices"
                                reference="commands"
                                source="command_id"
                                basePath="/invoices"
                                record={record}
                                linkType={false}
                            >
                                <Basket />
                            </ReferenceField>
                        </div>
                    </CardContent>
                </Card>
            )
        }
    </ShowController>
);

export default InvoiceShow;
