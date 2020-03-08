import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/Comment';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useTranslate } from 'react-admin';

import CardIcon from './CardIcon';

import StarRatingField from '../reviews/StarRatingField';
import { Customer, Review } from '../types';

interface Props {
    reviews?: Review[];
    customers?: { [key: string]: Customer };
    nb?: number;
}

const useStyles = makeStyles(theme => ({
    main: {
        flex: '1',
        marginRight: '1em',
        marginTop: 20,
    },
    titleLink: { textDecoration: 'none', color: 'inherit' },
    card: {
        padding: '16px 0',
        overflow: 'inherit',
        textAlign: 'right',
    },
    title: {
        padding: '0 16px',
    },
    value: {
        padding: '0 16px',
        minHeight: 48,
    },
    avatar: {
        background: theme.palette.background.paper,
    },
    listItemText: {
        overflowY: 'hidden',
        height: '4em',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
}));

const location = {
    pathname: 'reviews',
    query: { filter: JSON.stringify({ status: 'pending' }) },
};

const PendingReviews: FC<Props> = ({ reviews = [], customers = {}, nb }) => {
    const classes = useStyles();
    const translate = useTranslate();
    return (
        <div className={classes.main}>
            <CardIcon Icon={CommentIcon} bgColor="#f44336" />
            <Card className={classes.card}>
                <Typography className={classes.title} color="textSecondary">
                    {translate('pos.dashboard.pending_reviews')}
                </Typography>
                <Typography
                    variant="h5"
                    component="h2"
                    className={classes.value}
                >
                    <Link to={location} className={classes.titleLink}>
                        {nb}
                    </Link>
                </Typography>
                <Divider />
                <List>
                    {reviews.map((record: Review) => (
                        <ListItem
                            key={record.id}
                            button
                            component={Link}
                            to={`/reviews/${record.id}`}
                            alignItems="flex-start"
                        >
                            <ListItemAvatar>
                                {customers[record.customer_id] ? (
                                    <Avatar
                                        src={`${
                                            customers[record.customer_id].avatar
                                        }?size=32x32`}
                                        className={classes.avatar}
                                    />
                                ) : (
                                    <Avatar />
                                )}
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <StarRatingField
                                        record={record}
                                        size="small"
                                    />
                                }
                                secondary={record.comment}
                                className={classes.listItemText}
                                style={{ paddingRight: 0 }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Card>
        </div>
    );
};

export default PendingReviews;
