import * as React from 'react';
import { Box } from '@mui/material';
import Icon from '@mui/icons-material/Stars';

import { useRecordContext } from 'react-admin';

interface OwnProps {
    size?: 'large' | 'small';
    record?: any;
}

const StarRatingField = (props: OwnProps) => {
    const { size = 'large' } = props;
    const record = useRecordContext(props);
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
