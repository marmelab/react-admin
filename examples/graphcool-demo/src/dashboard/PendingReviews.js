import React from 'react';
import compose from 'recompose/compose';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import { Link } from 'react-router-dom';
import { translate } from 'react-admin';

import StarRatingField from '../reviews/StarRatingField';

const styles = theme => ({
    titleLink: { textDecoration: 'none', color: 'inherit' },
    card: { borderLeft: 'solid 4px #f44336', flex: 1, marginRight: '1em' },
    icon: {
        float: 'right',
        width: 64,
        height: 64,
        padding: '16px 16px 0 16px',
        color: '#f44336',
    },
    avatar: {
        background: theme.palette.background.contentFrame,
    },
    listItemText: {
        overflowY: 'hidden',
        height: '4em',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
});

const location = {
    pathname: 'reviews',
    query: { filter: JSON.stringify({ status: 'pending' }) },
};

const PendingReviews = ({
    reviews = [],
    customers = {},
    nb,
    translate,
    classes,
}) => (
    <Card className={classes.card}>
        <CommentIcon className={classes.icon} />
        <CardHeader
            title={
                <Link to={location} className={classes.titleLink}>
                    {nb}
                </Link>
            }
            subheader={translate('pos.dashboard.pending_reviews')}
        />
        <List>
            {reviews.map(record => (
                <ListItem
                    key={record.id}
                    button
                    component={Link}
                    to={`/reviews/${record.id}`}
                >
                    {record.customer && customers[record.customer.id] ? (
                        <Avatar
                            src={`${
                                customers[record.customer.id].avatar
                            }?size=32x32`}
                            className={classes.avatar}
                        />
                    ) : (
                        <Avatar />
                    )}

                    <ListItemText
                        primary={<StarRatingField record={record} />}
                        secondary={record.comment}
                        className={classes.listItemText}
                        style={{ paddingRight: 0 }}
                    />
                </ListItem>
            ))}
        </List>
    </Card>
);

const enhance = compose(
    withStyles(styles),
    translate
);

export default enhance(PendingReviews);
