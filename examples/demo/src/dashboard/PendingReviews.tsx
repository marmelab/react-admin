import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from 'react-router-dom';
import { useTranslate } from 'react-admin';

import CardWithIcon from './CardWithIcon';
import StarRatingField from '../reviews/StarRatingField';
import { Customer, Review } from '../types';

const PREFIX = 'PendingReviews';

const classes = {
    avatar: `${PREFIX}-avatar`,
    listItemText: `${PREFIX}-listItemText`,
    link: `${PREFIX}-link`,
    linkContent: `${PREFIX}-linkContent`,
};

const StyledCardWithIcon = styled(CardWithIcon, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${classes.avatar}`]: {
        background: theme.palette.background.paper,
    },

    [`& .${classes.listItemText}`]: {
        overflowY: 'hidden',
        height: '4em',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },

    [`& .${classes.link}`]: {
        borderRadius: 0,
    },

    [`& .${classes.linkContent}`]: {
        color: theme.palette.primary.main,
    },
}));

interface Props {
    reviews?: Review[];
    customers?: { [key: string]: Customer };
    nb?: number;
}

const PendingReviews = ({ reviews = [], customers = {}, nb }: Props) => {
    const translate = useTranslate();
    return (
        <StyledCardWithIcon
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
            <Box flexGrow={1}>&nbsp;</Box>
            <Button
                className={classes.link}
                component={Link}
                to="/reviews"
                size="small"
                color="primary"
            >
                <Box p={1} className={classes.linkContent}>
                    {translate('pos.dashboard.all_reviews')}
                </Box>
            </Button>
        </StyledCardWithIcon>
    );
};

export default PendingReviews;
