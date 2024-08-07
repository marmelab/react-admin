import * as React from 'react';
import { TextField, MenuItem } from '@mui/material';

import { Status } from '../misc/Status';
import { useConfigurationContext } from '../root/ConfigurationContext';

export const StatusSelector = ({ status, setStatus, sx }: any) => {
    const { noteStatuses } = useConfigurationContext();
    return (
        <TextField
            select
            value={status}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setStatus(event.target.value);
            }}
            variant="filled"
            label={false}
            margin="none"
            size="small"
            sx={sx}
        >
            {noteStatuses.map(status => (
                <MenuItem key={status.value} value={status.value}>
                    {status.label} <Status status={status.value} />
                </MenuItem>
            ))}
        </TextField>
    );
};
