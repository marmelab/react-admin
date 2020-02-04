import React from 'react';
import {
    NumberField,
    TextField,
    DateField,
    useTranslate,
    useGetList,
    linkToRecord,
} from 'react-admin';
import PropTypes from 'prop-types';
import {
    Tooltip,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    Box,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ContentCreate from '@material-ui/icons/Create';
import order from '../orders';
import review from '../reviews';
import { makeStyles } from '@material-ui/core/styles';

import ProductReferenceField from '../products/ProductReferenceField';
import StarRatingField from '../reviews/StarRatingField';

const useAsideStyles = makeStyles(theme => ({
    root: {
        width: 400,
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
}));

const Aside = ({ record, basePath }) => {
    const classes = useAsideStyles();
    return (
        <div className={classes.root}>
            {record && <EventList record={record} basePath={basePath} />}
        </div>
    );
};

Aside.propTypes = {
    record: PropTypes.any,
    basePath: PropTypes.string,
};

const EventList = ({ record, basePath }) => {
    const translate = useTranslate();
    const { data: orders, ids: orderIds } = useGetList(
        'commands',
        { page: 1, perPage: 100 },
        { field: 'date', order: 'DESC' },
        { customer_id: record && record.id }
    );
    const { data: reviews, ids: reviewIds } = useGetList(
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
                                {orderIds.length > 0 && (
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
                                {reviewIds.length > 0 && (
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

            {events.map(event =>
                event.type === 'order' ? (
                    <Order
                        record={event.data}
                        key={`event_${event.data.id}`}
                        basePath={basePath}
                    />
                ) : (
                    <Review
                        record={event.data}
                        key={`review_${event.data.id}`}
                        basePath={basePath}
                    />
                )
            )}
        </>
    );
};

const mixOrdersAndReviews = (orders, orderIds, reviews, reviewIds) => {
    const eventsFromOrders = orderIds.map(id => ({
        type: 'order',
        date: orders[id].date,
        data: orders[id],
    }));
    const eventsFromReviews = reviewIds.map(id => ({
        type: 'review',
        date: reviews[id].date,
        data: reviews[id],
    }));
    const events = eventsFromOrders.concat(eventsFromReviews);
    events.sort((e1, e2) => new Date(e1.date) - new Date(e2.date));
    return events;
};

const useEventStyles = makeStyles({
    card: {
        margin: '0 0 1em 1em',
    },
    cardHeader: {
        alignItems: 'flex-start',
    },
    clamp: {
        display: '-webkit-box',
        '-webkit-line-clamp': 3,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
    },
});

const Order = ({ record, basePath }) => {
    const translate = useTranslate();
    const classes = useEventStyles();
    return (
        <Card className={classes.card}>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Avatar
                        aria-label={translate('resources.commands.name', {
                            smart_count: 1,
                        })}
                        className={classes.avatar}
                    >
                        <order.icon />
                    </Avatar>
                }
                action={<EditButton record={record} basePath="/commands" />}
                title={`${translate('resources.commands.name', {
                    smart_count: 1,
                })} #${record.reference}`}
                subheader={
                    <>
                        <Typography variant="body2">{record.date}</Typography>
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
                }
            />
        </Card>
    );
};

const Review = ({ record, basePath }) => {
    const translate = useTranslate();
    const classes = useEventStyles();
    return (
        <Card className={classes.card}>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Avatar
                        aria-label={translate('resources.reviews.name', {
                            smart_count: 1,
                        })}
                        className={classes.avatar}
                    >
                        <review.icon />
                    </Avatar>
                }
                action={<EditButton record={record} basePath="/reviews" />}
                title={
                    <span>
                        {translate('resources.reviews.relative_to_poster')}{' '}
                        <ProductReferenceField
                            resource="reviews"
                            record={record}
                            basePath={basePath}
                        />
                    </span>
                }
                subheader={
                    <>
                        <Typography variant="body2">{record.date}</Typography>
                        <StarRatingField record={record} />
                        <Typography variant="inherit" className={classes.clamp}>
                            {record.comment}
                        </Typography>
                    </>
                }
            />
        </Card>
    );
};

const EditButton = ({ record, basePath }) => {
    const translate = useTranslate();
    return (
        <Tooltip title={translate('ra.action.edit')}>
            <IconButton
                aria-label={translate('ra.action.edit')}
                component={Link}
                to={linkToRecord(basePath, record && record.id)}
            >
                <ContentCreate />
            </IconButton>
        </Tooltip>
    );
};

export default Aside;
