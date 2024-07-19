import * as React from 'react';
import { Box, Tooltip } from '@mui/material';

const STATUS_MAP = new Map<string, { color: string; label: string }>([
    ['cold', { color: '#7dbde8', label: 'Cold' }],
    ['warm', { color: '#e8cb7d', label: 'Warm' }],
    ['hot', { color: '#e88b7d', label: 'Hot' }],
    ['in-contract', { color: '#a4e87d', label: 'In Contract' }],
]);

const DEFAULT_STATUS = { color: '#000', label: 'Unknown' };

export const Status = ({ status }: { status: string }) => {
    const { color, label } = STATUS_MAP.get(status) || DEFAULT_STATUS;

    return (
        <Tooltip title={label} placement="top">
            <Box
                marginLeft={0.5}
                width={10}
                height={10}
                display="inline-block"
                borderRadius="5px"
                bgcolor={color}
                component="span"
            />
        </Tooltip>
    );
};
