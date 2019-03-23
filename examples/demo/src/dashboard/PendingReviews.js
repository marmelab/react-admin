import React, { Fragment } from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { translate, Query, GET_LIST } from 'react-admin';

import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/Comment';
import Divider from '@material-ui/core/Divider';

import CardIcon from './CardIcon';
import CustomerAvatar from './CustomerAvatar';

import StarRatingField from '../reviews/StarRatingField';

const styles = theme => ({
    main: {
        flex: '1',
        marginRight: '1em',
        marginTop: 20
    },
    titleLink: { textDecoration: 'none', color: 'inherit' },
    card: {
        padding: '16px 0',
        overflow: 'inherit',
        textAlign: 'right'
    },
    title: {
        padding: '0 16px'
    },
    value: {
        padding: '0 16px',
        minHeight: 48
    },
    avatar: {
        background: theme.palette.background.avatar
    },
    listItemText: {
        overflowY: 'hidden',
        height: '4em',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    }
});

const location = {
    pathname: 'reviews',
    query: { filter: JSON.stringify({ status: 'pending' }) }
};

const payload = {
    filter: { status: 'pending' },
    sort: { field: 'date', order: 'DESC' },
    pagination: { page: 1, perPage: 100 }
};

const PendingReviews = ({ translate, classes }) => (
    <div className={classes.main}>
        <CardIcon Icon={CommentIcon} bgColor="#f44336" />
        <Card className={classes.card}>
            <Typography className={classes.title} color="textSecondary">
                {translate('pos.dashboard.pending_reviews')}
            </Typography>
            <Query type={GET_LIST} resource="reviews" payload={payload}>
                {({ data: reviews, total }) => (
                    <Fragment>
                        <Typography variant="headline" component="h2" className={classes.value}>
                            <Link to={location} className={classes.titleLink}>
                                {total}
                            </Link>
                        </Typography>
                        <Divider />
                        <List>
                            {reviews &&
                                reviews.map(record => (
                                    <ListItem key={record.id} button component={Link} to={`/reviews/${record.id}`}>
                                        <CustomerAvatar record={record} classes={classes} />
                                        <ListItemText
                                            primary={<StarRatingField record={record} />}
                                            secondary={record.comment}
                                            className={classes.listItemText}
                                            style={{ paddingRight: 0 }}
                                        />
                                    </ListItem>
                                ))}
                        </List>
                    </Fragment>
                )}
            </Query>
        </Card>
    </div>
);

const enhance = compose(
    withStyles(styles),
    translate
);

export default enhance(PendingReviews);
