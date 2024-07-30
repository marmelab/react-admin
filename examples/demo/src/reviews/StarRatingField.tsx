import * as React from 'react';
import { Box } from '@mui/material';
import Icon from '@mui/icons-material/Stars';

import { FieldProps, useRecordContext } from 'react-admin';

interface OwnProps {
    size?: 'large' | 'small';
}

const StarRatingField = ({ size = 'large' }: FieldProps & OwnProps) => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Box
            component="span"
            display="flex"
            sx={{
                opacity: 0.87,
                whiteSpace: 'nowrap',
            }}
        >
            {Array(record.rating)
                .fill(true)
                .map((_, i) => (
                    <Icon
                        key={i}
                        sx={{
                            width: size === 'large' ? 20 : 15,
                            height: size === 'large' ? 20 : 15,
                        }}
                    />
                ))}
        </Box>
    );
};

export default StarRatingField;
