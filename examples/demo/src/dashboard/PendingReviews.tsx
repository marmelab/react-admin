import * as React from 'react';
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

interface Props {
    reviews?: Review[];
    customers?: { [key: string]: Customer };
    nb?: number;
}

const PendingReviews = ({ reviews = [], customers = {}, nb }: Props) => {
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
                                    sx={{ bgcolor: 'background.paper' }}
                                />
                            ) : (
                                <Avatar />
                            )}
                        </ListItemAvatar>

                        <ListItemText
                            primary={<StarRatingField record={record} />}
                            secondary={record.comment}
                            sx={{
                                overflowY: 'hidden',
                                height: '4em',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                paddingRight: 0,
                            }}
                        />
                    </ListItem>
                ))}
            </List>
            <Box flexGrow={1}>&nbsp;</Box>
            <Button
                sx={{ borderRadius: 0 }}
                component={Link}
                to="/reviews"
                size="small"
                color="primary"
            >
                <Box p={1} sx={{ color: 'primary.main' }}>
                    {translate('pos.dashboard.all_reviews')}
                </Box>
            </Button>
        </CardWithIcon>
    );
};

export default PendingReviews;
