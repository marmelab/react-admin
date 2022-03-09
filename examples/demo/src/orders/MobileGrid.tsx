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
    RaRecord,
    RecordContextProvider,
} from 'react-admin';

import CustomerReferenceField from '../visitors/CustomerReferenceField';
import { Order } from '../types';

interface MobileGridProps {
    data?: RaRecord[];
}

const MobileGrid = (props: MobileGridProps) => {
    const { data, isLoading } = useListContext<Order>();
    const translate = useTranslate();
    if (isLoading || data.length === 0) {
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
                                    {translate('resources.commands.name', 1)} #
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
                                sx={{ display: 'block', mb: 1 }}
                            />
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.reviews.fields.date')}
                                :&nbsp;
                                <DateField source="date" showTime />
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate(
                                    'resources.commands.fields.basket.total'
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
                                {translate('resources.commands.fields.status')}
                                :&nbsp;
                                <TextField source="status" />
                            </Typography>
                            <Typography variant="body2">
                                {translate(
                                    'resources.commands.fields.returned'
                                )}
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

MobileGrid.defaultProps = {
    data: {},
    ids: [],
};

export default MobileGrid;
