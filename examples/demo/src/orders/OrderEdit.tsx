import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    BooleanInput,
    DateField,
    Edit,
    Form,
    Labeled,
    ReferenceField,
    SelectInput,
    TextField,
    Toolbar,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Box, Grid, Typography, Link } from '@mui/material';

import { Order, Customer } from '../types';
import Basket from './Basket';
import Totals from './Totals';

const PREFIX = 'OrderEdit';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledEdit = styled(Edit)({
    [`&.${classes.root}`]: { alignItems: 'flex-start' },
});

const OrderTitle = () => {
    const translate = useTranslate();
    const record = useRecordContext<Order>();
    return record ? (
        <span>
            {translate('resources.commands.title', {
                reference: record.reference,
            })}
        </span>
    ) : null;
};

const CustomerDetails = () => {
    const record = useRecordContext<Customer>();
    return (
        <Box display="flex" flexDirection="column">
            <Typography
                component={RouterLink}
                color="primary"
                to={`/customers/${record?.id}`}
                style={{ textDecoration: 'none' }}
            >
                {record?.first_name} {record?.last_name}
            </Typography>
            <Typography
                component={Link}
                color="primary"
                href={`mailto:${record?.email}`}
                style={{ textDecoration: 'none' }}
            >
                {record?.email}
            </Typography>
        </Box>
    );
};

const CustomerAddress = () => {
    const record = useRecordContext<Customer>();
    return (
        <Box>
            <Typography>
                {record?.first_name} {record?.last_name}
            </Typography>
            <Typography>{record?.address}</Typography>
            <Typography>
                {record?.city}, {record?.stateAbbr} {record?.zipcode}
            </Typography>
        </Box>
    );
};

const Spacer = () => <Box m={1}>&nbsp;</Box>;

const OrderForm = () => {
    const translate = useTranslate();

    return (
        <Form
            render={({ handleSubmit, ...formProps }: any) => (
                <form onSubmit={handleSubmit}>
                    <Box maxWidth="50em">
                        <Card>
                            <CardContent>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={12} md={8}>
                                        <Typography variant="h6" gutterBottom>
                                            {translate(
                                                'resources.commands.section.order'
                                            )}
                                        </Typography>
                                        <Grid container>
                                            <Grid item xs={12} sm={12} md={6}>
                                                <Labeled
                                                    source="date"
                                                    resource="commands"
                                                >
                                                    <DateField
                                                        source="date"
                                                        resource="commands"
                                                    />
                                                </Labeled>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={6}>
                                                <Labeled
                                                    source="reference"
                                                    resource="commands"
                                                >
                                                    <TextField
                                                        source="reference"
                                                        resource="commands"
                                                    />
                                                </Labeled>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={12} sm={12} md={6}>
                                                <SelectInput
                                                    resource="commands"
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
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={6}>
                                                <Box mt={2}>
                                                    <BooleanInput
                                                        row={true}
                                                        resource="commands"
                                                        source="returned"
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography variant="h6" gutterBottom>
                                            {translate(
                                                'resources.commands.section.customer'
                                            )}
                                        </Typography>
                                        <ReferenceField
                                            source="customer_id"
                                            resource="commands"
                                            reference="customers"
                                            link={false}
                                        >
                                            <CustomerDetails />
                                        </ReferenceField>
                                        <Spacer />

                                        <Typography variant="h6" gutterBottom>
                                            {translate(
                                                'resources.commands.section.shipping_address'
                                            )}
                                        </Typography>
                                        <ReferenceField
                                            source="customer_id"
                                            resource="commands"
                                            reference="customers"
                                            link={false}
                                        >
                                            <CustomerAddress />
                                        </ReferenceField>
                                    </Grid>
                                </Grid>
                                <Spacer />

                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.commands.section.items'
                                    )}
                                </Typography>
                                <Box>
                                    <Basket />
                                </Box>
                                <Spacer />

                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.commands.section.total'
                                    )}
                                </Typography>
                                <Box>
                                    <Totals />
                                </Box>
                            </CardContent>
                            <Toolbar
                                mutationMode="undoable"
                                saving={formProps.saving}
                                resource="commands"
                            />
                        </Card>
                    </Box>
                </form>
            )}
        />
    );
};
const OrderEdit = () => (
    <StyledEdit title={<OrderTitle />} component="div">
        <OrderForm />
    </StyledEdit>
);

export default OrderEdit;
