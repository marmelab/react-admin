import * as React from 'react';
import { FC } from 'react';
import Icon from '@material-ui/icons/Stars';
import { makeStyles } from '@material-ui/core/styles';

import { FieldProps } from 'react-admin';

const useStyles = makeStyles({
    root: {
        opacity: 0.87,
        whiteSpace: 'nowrap',
        display: 'flex',
    },
    large: {
        width: 20,
        height: 20,
    },
    small: {
        width: 15,
        height: 15,
    },
});

interface OwnProps {
    size?: 'large' | 'small';
}

const StarRatingField: FC<FieldProps & OwnProps> = ({
    record,
    size = 'large',
}) => {
    const classes = useStyles();
    return record ? (
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
    ) : null;
};

StarRatingField.defaultProps = {
    label: 'resources.reviews.fields.rating',
    source: 'rating',
    addLabel: true,
};

export default StarRatingField;
