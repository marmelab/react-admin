import * as React from 'react';
import {
    NumberField,
    TextField,
    DateField,
    useTranslate,
    useGetList,
    RecordContextProvider,
    ReferenceField,
    useLocaleState,
    useRecordContext,
} from 'react-admin';
import {
    Typography,
    Card,
    CardContent,
    Box,
    Link,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Grid,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import order from '../orders';
import review from '../reviews';
import StarRatingField from '../reviews/StarRatingField';
import {
    Order as OrderRecord,
    Review as ReviewRecord,
    Customer,
} from '../types';

const Aside = () => {
    const record = useRecordContext<Customer>();
    return (
        <Box width={400} display={{ xs: 'none', lg: 'block' }}>
            {record && <EventList />}
        </Box>
    );
};

const EventList = () => {
    const record = useRecordContext<Customer>();
    const translate = useTranslate();
    const [locale] = useLocaleState();

    const { data: orders } = useGetList<OrderRecord>('commands', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'date', order: 'DESC' },
        filter: { customer_id: record.id },
    });
    const { data: reviews } = useGetList<ReviewRecord>('reviews', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'date', order: 'DESC' },
        filter: { customer_id: record.id },
    });
    const events = mixOrdersAndReviews(orders, reviews);

    return (
        <Box ml={2}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {translate('resources.customers.fieldGroups.history')}
                    </Typography>
                    <Grid container rowSpacing={1} columnSpacing={1}>
                        <Grid item xs={6} display="flex" gap={1}>
                            <AccessTimeIcon fontSize="small" color="disabled" />
                            <Box flexGrow={1}>
                                <Typography variant="body2">
                                    {translate(
                                        'resources.customers.fields.first_seen'
                                    )}
                                </Typography>
                                <DateField
                                    record={record}
                                    source="first_seen"
                                />
                            </Box>
                        </Grid>
                        {orders && (
                            <Grid item xs={6} display="flex" gap={1}>
                                <order.icon fontSize="small" color="disabled" />
                                <Typography variant="body2" flexGrow={1}>
                                    {translate('resources.commands.amount', {
                                        smart_count: orders.length,
                                    })}
                                </Typography>
                            </Grid>
                        )}
                        <Grid item xs={6} display="flex" gap={1}>
                            <AccessTimeIcon fontSize="small" color="disabled" />
                            <Box flexGrow={1}>
                                <Typography variant="body2">
                                    {translate(
                                        'resources.customers.fields.last_seen'
                                    )}
                                </Typography>
                                <DateField record={record} source="last_seen" />
                            </Box>
                        </Grid>
                        {reviews && (
                            <Grid item xs={6} display="flex" gap={1}>
                                <review.icon
                                    fontSize="small"
                                    color="disabled"
                                />
                                <Typography variant="body2" flexGrow={1}>
                                    {translate('resources.reviews.amount', {
                                        smart_count: reviews.length,
                                    })}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            <Stepper orientation="vertical" sx={{ mt: 1 }}>
                {events.map(event => (
                    <Step
                        key={`${event.type}-${event.data.id}`}
                        expanded
                        active
                        completed
                    >
                        <StepLabel
                            icon={
                                event.type === 'order' ? (
                                    <order.icon
                                        color="disabled"
                                        sx={{ pl: 0.5, fontSize: '1.25rem' }}
                                    />
                                ) : (
                                    <review.icon
                                        color="disabled"
                                        sx={{ pl: 0.5, fontSize: '1.25rem' }}
                                    />
                                )
                            }
                        >
                            {new Date(event.date).toLocaleString(locale, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                            })}
                        </StepLabel>
                        <StepContent>
                            <RecordContextProvider value={event.data}>
                                {event.type === 'order' ? (
                                    <Order />
                                ) : (
                                    <Review />
                                )}
                            </RecordContextProvider>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

interface AsideEvent {
    type: string;
    date: Date;
    data: OrderRecord | ReviewRecord;
}

const mixOrdersAndReviews = (
    orders?: OrderRecord[],
    reviews?: ReviewRecord[]
): AsideEvent[] => {
    const eventsFromOrders = orders
        ? orders.map<AsideEvent>(order => ({
              type: 'order',
              date: order.date,
              data: order,
          }))
        : [];
    const eventsFromReviews = reviews
        ? reviews.map<AsideEvent>(review => ({
              type: 'review',
              date: review.date,
              data: review,
          }))
        : [];
    const events = eventsFromOrders.concat(eventsFromReviews);
    events.sort(
        (e1, e2) => new Date(e2.date).getTime() - new Date(e1.date).getTime()
    );
    return events;
};

const Order = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    if (!record) return null;
    return (
        <>
            <Typography variant="body2" gutterBottom>
                <Link to={`/commands/${record.id}`} component={RouterLink}>
                    {translate('resources.commands.name', { smart_count: 1 })}
                    &nbsp;#{record.reference}
                </Link>
            </Typography>
            <Typography variant="body2" color="textSecondary">
                {translate('resources.commands.nb_items', {
                    smart_count: record.basket.length,
                    _: '1 item |||| %{smart_count} items',
                })}
                &nbsp;-&nbsp;
                <NumberField
                    source="total"
                    options={{ style: 'currency', currency: 'USD' }}
                />
                &nbsp;-&nbsp;
                <TextField source="status" />
            </Typography>
        </>
    );
};

const Review = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    if (!record) return null;
    return (
        <>
            <Typography variant="body2" gutterBottom>
                <Link to={`/reviews/${record.id}`} component={RouterLink}>
                    {translate('resources.reviews.relative_to_poster')} "
                    <ReferenceField
                        source="product_id"
                        reference="products"
                        resource="reviews"
                        link={false}
                    >
                        <TextField source="reference" component="span" />
                    </ReferenceField>
                    "
                </Link>
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                <StarRatingField />
            </Typography>
            <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}
            >
                {record.comment}
            </Typography>
        </>
    );
};

export default Aside;
