// in src/comments.js
import * as React from 'react';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import {
    DateField,
    EditButton,
    useTranslate,
    NumberField,
    RecordContextProvider,
    useListContext,
} from 'react-admin';

import AvatarField from './AvatarField';
import ColoredNumberField from './ColoredNumberField';
import SegmentsField from './SegmentsField';
import { Customer } from '../types';

const MobileGrid = () => {
    const translate = useTranslate();
    const { data, error, isPending } = useListContext<Customer>();

    if (isPending || error || data.length === 0) {
        return null;
    }

    return (
        <Box margin="0.5em">
            {data.map(record => (
                <RecordContextProvider key={record.id} value={record}>
                    <Card sx={{ margin: '0.5rem 0' }}>
                        <CardHeader
                            title={`${record.first_name} ${record.last_name}`}
                            subheader={
                                <>
                                    {translate(
                                        'resources.customers.fields.last_seen_gte'
                                    )}
                                    &nbsp;
                                    <DateField source="last_seen" />
                                </>
                            }
                            avatar={<AvatarField size="45" />}
                            action={<EditButton />}
                        />
                        <CardContent sx={{ pt: 0 }}>
                            <Typography variant="body2">
                                {translate(
                                    'resources.orders.name',
                                    record.nb_orders || 1
                                )}
                                :&nbsp;
                                <NumberField source="nb_orders" />
                            </Typography>
                            <Typography variant="body2">
                                {translate(
                                    'resources.customers.fields.total_spent'
                                )}
                                :&nbsp;
                                <ColoredNumberField
                                    source="total_spent"
                                    options={{
                                        style: 'currency',
                                        currency: 'USD',
                                    }}
                                    textAlign="right"
                                />
                            </Typography>
                        </CardContent>
                        {record.groups && record.groups.length > 0 && (
                            <CardContent sx={{ pt: 0 }}>
                                <SegmentsField />
                            </CardContent>
                        )}
                    </Card>
                </RecordContextProvider>
            ))}
        </Box>
    );
};

export default MobileGrid;
