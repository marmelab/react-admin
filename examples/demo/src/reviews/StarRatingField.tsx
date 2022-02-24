import * as React from 'react';
import { styled } from '@mui/material/styles';
import Icon from '@mui/icons-material/Stars';

import { FieldProps, Labeled, useRecordContext } from 'react-admin';

const PREFIX = 'StarRatingField';

const classes = {
    root: `${PREFIX}-root`,
    large: `${PREFIX}-large`,
    small: `${PREFIX}-small`,
};

const Root = styled('span')({
    [`&.${classes.root}`]: {
        opacity: 0.87,
        whiteSpace: 'nowrap',
        display: 'flex',
    },
    [`& .${classes.large}`]: {
        width: 20,
        height: 20,
    },
    [`& .${classes.small}`]: {
        width: 15,
        height: 15,
    },
});

interface OwnProps {
    size?: 'large' | 'small';
}

const StarRatingField = ({ size = 'large' }: FieldProps & OwnProps) => {
    const record = useRecordContext();

    return record ? (
        <Labeled source="rating">
            <Root className={classes.root}>
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
            </Root>
        </Labeled>
    ) : null;
};

StarRatingField.defaultProps = {
    label: 'resources.reviews.fields.rating',
    source: 'rating',
};

export default StarRatingField;
