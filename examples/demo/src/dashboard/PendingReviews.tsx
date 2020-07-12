import * as React from 'react';
import { FC } from 'react';
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import { Link } from 'react-router-dom';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';
import StarRatingField from '../reviews/StarRatingField';
import { Customer, Review } from '../types';

interface Props {
    reviews?: Review[];
    customers?: { [key: string]: Customer };
    nb?: number;
}

const useStyles = makeStyles(theme => ({
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

const PendingReviews: FC<Props> = ({ reviews = [], customers = {}, nb }) => {
    const classes = useStyles();
    const translate = useTranslate();
    return (
        <CardWithIcon
            to="/reviews"
            icon={CommentIcon}
            title={translate('pos.dashboard.pending_reviews')}
            subtitle={nb}
        >
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
                            primary={<StarRatingField record={record} />}
                            secondary={record.comment}
                            className={classes.listItemText}
                            style={{ paddingRight: 0 }}
                        />
                    </ListItem>
                ))}
            </List>
        </CardWithIcon>
    );
};

export default PendingReviews;
