// in src/comments.js
import * as React from 'react';
import { Box, Card, CardHeader, CardContent, Typography } from '@mui/material';
import {
    DateField,
    EditButton,
    NumberField,
    TextField,
    BooleanField,
    useTranslate,
    useListContext,
    RecordContextProvider,
} from 'react-admin';

import CustomerReferenceField from '../visitors/CustomerReferenceField';
import { Order } from '../types';

const MobileGrid = () => {
    const { data, error, isPending } = useListContext<Order>();
    const translate = useTranslate();
    if (isPending || error || data.length === 0) {
        return null;
    }
    return (
        <Box margin="0.5em">
            {data.map(record => (
                <RecordContextProvider key={record.id} value={record}>
                    <Card sx={{ margin: '0.5rem 0' }}>
                        <CardHeader
                            title={
                                <>
                                    {translate('resources.orders.name', 1)} #
                                    <TextField
                                        source="reference"
                                        variant="body1"
                                    />
                                </>
                            }
                            titleTypographyProps={{ variant: 'body1' }}
                            action={<EditButton />}
                        />
                        <CardContent sx={{ pt: 0 }}>
                            <CustomerReferenceField
                                source="customer_id"
                                sx={{ display: 'block', mb: 1 }}
                            />
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.reviews.fields.date')}
                                :&nbsp;
                                <DateField source="date" showTime />
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate(
                                    'resources.orders.fields.basket.total'
                                )}
                                :&nbsp;
                                <NumberField
                                    source="total"
                                    options={{
                                        style: 'currency',
                                        currency: 'USD',
                                    }}
                                />
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.orders.fields.status')}
                                :&nbsp;
                                <TextField source="status" />
                            </Typography>
                            <Typography variant="body2">
                                {translate('resources.orders.fields.returned')}
                                :&nbsp;
                                <BooleanField source="returned" />
                            </Typography>
                        </CardContent>
                    </Card>
                </RecordContextProvider>
            ))}
        </Box>
    );
};

export default MobileGrid;
