import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import {
    NumberField,
    TextField,
    DateField,
    useTranslate,
    useGetList,
    Record,
    RecordMap,
    Identifier,
    ReferenceField,
    useLocale,
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
    [`& .${classes.root}`]: {
        width: 400,
        [theme.breakpoints.down('lg')]: {
            display: 'none',
        },
    },
}));

interface AsideProps {
    record?: Record;
    basePath?: string;
}

const Aside = ({ record, basePath }: AsideProps) => (
    <AsideRoot className={classes.root}>
        {record && <EventList record={record} basePath={basePath} />}
    </AsideRoot>
);

Aside.propTypes = {
    record: PropTypes.any,
    basePath: PropTypes.string,
};

interface EventListProps {
    record?: Record;
    basePath?: string;
}

const StyledStepper = styled(Stepper)({
    '&': {
        background: 'none',
        border: 'none',
        marginLeft: '0.3em',
    },
});

const EventList = ({ record, basePath }: EventListProps) => {
    const translate = useTranslate();
    const locale = useLocale();
    const { data: orders, ids: orderIds } = useGetList<OrderRecord>(
        'commands',
        { page: 1, perPage: 100 },
        { field: 'date', order: 'DESC' },
        { customer_id: record && record.id }
    );
    const { data: reviews, ids: reviewIds } = useGetList<ReviewRecord>(
        'reviews',
        { page: 1, perPage: 100 },
        { field: 'date', order: 'DESC' },
        { customer_id: record && record.id }
    );
    const events = mixOrdersAndReviews(orders, orderIds, reviews, reviewIds);

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
                                {orderIds && orderIds.length > 0 && (
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
                                                            orderIds.length,
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
                                {reviewIds && reviewIds.length > 0 && (
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
                                                            reviewIds.length,
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
            <StyledStepper orientation="vertical">
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
                                    basePath={basePath}
                                />
                            ) : (
                                <Review
                                    record={event.data as ReviewRecord}
                                    key={`review_${event.data.id}`}
                                    basePath={basePath}
                                />
                            )}
                        </StepContent>
                    </Step>
                ))}
            </StyledStepper>
        </>
    );
};

interface AsideEvent {
    type: string;
    date: Date;
    data: OrderRecord | ReviewRecord;
}

const mixOrdersAndReviews = (
    orders?: RecordMap<OrderRecord>,
    orderIds?: Identifier[],
    reviews?: RecordMap<ReviewRecord>,
    reviewIds?: Identifier[]
): AsideEvent[] => {
    const eventsFromOrders =
        orderIds && orders
            ? orderIds.map<AsideEvent>(id => ({
                  type: 'order',
                  date: orders[id].date,
                  data: orders[id],
              }))
            : [];
    const eventsFromReviews =
        reviewIds && reviews
            ? reviewIds.map<AsideEvent>(id => ({
                  type: 'review',
                  date: reviews[id].date,
                  data: reviews[id],
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
    basePath?: string;
}

const Order = ({ record, basePath }: OrderProps) => {
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
                    basePath={basePath}
                />
                &nbsp;-&nbsp;
                <TextField
                    source="status"
                    record={record}
                    basePath={basePath}
                />
            </Typography>
        </>
    ) : null;
};

interface ReviewProps {
    record?: ReviewRecord;
    basePath?: string;
}

const ReviewRoot = styled('div')({
    '& .clamp': {
        display: '-webkit-box',
        '-webkit-line-clamp': 3,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
    },
});

const Review = ({ record, basePath }: ReviewProps) => {
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
                        basePath={basePath}
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
