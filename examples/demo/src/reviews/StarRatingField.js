import React from 'react';
import Icon from '@material-ui/icons/Stars';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        opacity: 0.87,
        whiteSpace: 'nowrap',
    },
    large: {
        width: 20,
        height: 20,
    },
    small: {
        width: 15,
        haight: 15,
    },
});

const StarRatingField = ({ record, size = 'large' }) => {
    const classes = useStyles();
    return (
        <span className={classes.root}>
            {Array(record.rating)
                .fill(true)
                .map((_, i) => (
                    <Icon
                        key={i}
                        className={
                            size === 'large' ? classes.large : classes.small
                        }
                    />
                ))}
        </span>
    );
};

StarRatingField.defaultProps = {
    label: 'resources.reviews.fields.rating',
    source: 'rating',
    addLabel: true,
};

export default StarRatingField;
