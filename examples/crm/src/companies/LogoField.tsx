import * as React from 'react';
import { useRecordContext } from 'react-admin';
import { Box } from '@mui/material';

const sizeInPixel = {
    medium: 42,
    small: 20,
};

export const LogoField = ({
    source,
    size = 'medium',
}: {
    source?: string;
    size?: 'small' | 'medium';
}) => {
    const record = useRecordContext<{ logo: string; name: string }>();
    if (!record) return null;
    return (
        <Box
            component="img"
            src={process.env.PUBLIC_URL + record.logo}
            alt={record.name}
            title={record.name}
            width={sizeInPixel[size]}
            height={sizeInPixel[size]}
            sx={{ objectFit: 'contain' }}
        />
    );
};
