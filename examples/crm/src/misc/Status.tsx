import * as React from 'react';
import { Box, Tooltip } from '@mui/material';

const getColorFromStatus = (status: string) =>
    status === 'cold'
        ? '#7dbde8'
        : status === 'warm'
          ? '#e8cb7d'
          : status === 'hot'
            ? '#e88b7d'
            : status === 'in-contract'
              ? '#a4e87d'
              : '#000';

export const Status = ({ status }: { status: string }) => (
    <Tooltip title={status} placement="top">
        <Box
            marginLeft={0.5}
            width={10}
            height={10}
            display="inline-block"
            borderRadius="5px"
            bgcolor={getColorFromStatus(status)}
            component="span"
        />
    </Tooltip>
);
