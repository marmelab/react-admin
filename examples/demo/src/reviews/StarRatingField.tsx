import React, { FC } from 'react';
import Icon from '@material-ui/icons/Stars';
import { FieldProps } from '../types';

const style = { opacity: 0.87, width: 20, height: 20 };

const StarRatingField: FC<FieldProps> = ({ record }) =>
    record ? (
        <span>
            {Array(record.rating)
                .fill(true)
                .map((_, i) => (
                    <Icon key={i} style={style} />
                ))}
        </span>
    ) : null;

StarRatingField.defaultProps = {
    label: 'resources.reviews.fields.rating',
    source: 'rating',
    addLabel: true,
};

export default StarRatingField;
