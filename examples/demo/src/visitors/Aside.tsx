import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import {
    NumberField,
    TextField,
    DateField,
    useTranslate,
    useGetList,
    RaRecord,
    ReferenceField,
    useLocale,
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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import order from '../orders';
import review from '../reviews';
import StarRatingField from '../reviews/StarRatingField';
import { Order as OrderRecord, Review as ReviewRecord } from '../types';

const PREFIX = 'Aside';

const classes = {
    root: `${PREFIX}-root`,
};

const AsideRoot = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        width: 400,
        [theme.breakpoints.down('lg')]: {
            display: 'none',
        },
    },
}));

const Aside = () => {
    const record = useRecordContext();

    return (
        <AsideRoot className={classes.root}>
            {record && <EventList record={record} />}
        </AsideRoot>
    );
};
Aside.propTypes = {
    record: PropTypes.any,
};

interface EventListProps {
    record?: RaRecord;
}

const EventList = ({ record }: EventListProps) => {
    const translate = useTranslate();
    const locale = useLocale();
    const { data: orders } = useGetList<OrderRecord>('commands', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'date', order: 'DESC' },
        filter: { customer_id: record && record.id },
    });
    const { data: reviews } = useGetList<ReviewRecord>('reviews', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'date', order: 'DESC' },
        filter: { customer_id: record && record.id },
    });
    const events = mixOrdersAndReviews(orders, reviews);

    return (
        <>
            <Box m="0 0 1em 1em">
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {translate(
                                'resources.customers.fieldGroups.history'
                            )}
                        </Typography>
                        <Box display="flex">
                            <Box flexGrow={1}>
                                <Box display="flex" mb="1em">
                                    <Box mr="1em">
                                        <AccessTimeIcon
                                            fontSize="small"
                                            color="disabled"
                                        />
                                    </Box>
                                    <Box flexGrow={1}>
                                        <Typography>
                                            {translate(
                                                'resources.customers.fields.first_seen'
                                            )}
                                        </Typography>
                                        <DateField
                                            record={record}
                                            source="first_seen"
                                        />
                                    </Box>
                                </Box>
                                {orders && (
                                    <Box display="flex">
                                        <Box mr="1em">
                                            <order.icon
                                                fontSize="small"
                                                color="disabled"
                                            />
                                        </Box>
                                        <Box flexGrow={1}>
                                            <Typography>
                                                {translate(
                                                    'resources.commands.amount',
                                                    {
                                                        smart_count:
                                                            orders.length,
                                                    }
                                                )}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                            <Box flexGrow={1}>
                                <Box display="flex" mb="1em">
                                    <Box mr="1em">
                                        <AccessTimeIcon
                                            fontSize="small"
                                            color="disabled"
                                        />
                                    </Box>
                                    <Box flexGrow={1}>
                                        <Typography>
                                            {translate(
                                                'resources.customers.fields.last_seen'
                                            )}
                                        </Typography>
                                        <DateField
                                            record={record}
                                            source="last_seen"
                                        />
                                    </Box>
                                </Box>
                                {reviews && (
                                    <Box display="flex">
                                        <Box mr="1em">
                                            <review.icon
                                                fontSize="small"
                                                color="disabled"
                                            />
                                        </Box>
                                        <Box flexGrow={1}>
                                            <Typography>
                                                {translate(
                                                    'resources.reviews.amount',
                                                    {
                                                        smart_count:
                                                            reviews.length,
                                                    }
                                                )}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <Stepper
                orientation="vertical"
                sx={{
                    ml: 3.5,
                }}
            >
                {events.map(event => (
                    <Step
                        key={`${event.type}-${event.data.id}`}
                        expanded
                        active
                        completed
                    >
                        <StepLabel
                            StepIconComponent={() => {
                                const Component =
                                    event.type === 'order'
                                        ? order.icon
                                        : review.icon;
                                return (
                                    <Component
                                        fontSize="small"
                                        color="disabled"
                                        style={{ paddingLeft: 3 }}
                                    />
                                );
                            }}
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
                            {event.type === 'order' ? (
                                <Order
                                    record={event.data as OrderRecord}
                                    key={`event_${event.data.id}`}
                                />
                            ) : (
                                <Review
                                    record={event.data as ReviewRecord}
                                    key={`review_${event.data.id}`}
                                />
                            )}
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </>
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

interface OrderProps {
    record?: OrderRecord;
}

const Order = ({ record }: OrderProps) => {
    const translate = useTranslate();
    return record ? (
        <>
            <Typography variant="body2" gutterBottom>
                <Link to={`/commands/${record.id}`} component={RouterLink}>
                    {translate('resources.commands.name', {
                        smart_count: 1,
                    })}{' '}
                    #{record.reference}
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
                    options={{
                        style: 'currency',
                        currency: 'USD',
                    }}
                    record={record}
                />
                &nbsp;-&nbsp;
                <TextField source="status" record={record} />
            </Typography>
        </>
    ) : null;
};

interface ReviewProps {
    record?: ReviewRecord;
}

const ReviewRoot = styled('div')({
    '& .clamp': {
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
});

const Review = ({ record }: ReviewProps) => {
    const translate = useTranslate();
    return record ? (
        <ReviewRoot>
            <Typography variant="body2" gutterBottom>
                <Link to={`/reviews/${record.id}`} component={RouterLink}>
                    {translate('resources.reviews.relative_to_poster')} "
                    <ReferenceField
                        source="product_id"
                        reference="products"
                        resource="reviews"
                        record={record}
                        link={false}
                    >
                        <TextField source="reference" component="span" />
                    </ReferenceField>
                    "
                </Link>
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                <StarRatingField record={record} />
            </Typography>
            <Typography variant="body2" color="textSecondary" className="clamp">
                {record.comment}
            </Typography>
        </ReviewRoot>
    ) : null;
};

export default Aside;
