import * as React from 'react';
import { Box, Tooltip } from '@mui/material';
import { useConfigurationContext } from '../root/ConfigurationContext';

export const Status = ({ status }: { status: string }) => {
    const { noteStatuses } = useConfigurationContext();
    if (!status || !noteStatuses) return null;
    const statusObject = noteStatuses.find((s: any) => s.value === status);

    if (!statusObject) return null;
    return (
        <Tooltip title={statusObject.label} placement="top">
            <Box
                marginLeft={0.5}
                width={10}
                height={10}
                display="inline-block"
                borderRadius="5px"
                bgcolor={statusObject.color}
                component="span"
            />
        </Tooltip>
    );
};
