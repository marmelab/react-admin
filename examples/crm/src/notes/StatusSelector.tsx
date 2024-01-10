import * as React from 'react';
import { TextField, MenuItem } from '@mui/material';

import { Status } from '../misc/Status';

export const StatusSelector = ({ status, setStatus, sx }: any) => (
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
        <MenuItem value="cold">
            Cold <Status status="cold" />
        </MenuItem>
        <MenuItem value="warm">
            Warm <Status status="warm" />
        </MenuItem>
        <MenuItem value="hot">
            Hot <Status status="hot" />
        </MenuItem>
        <MenuItem value="in-contract">
            In Contract <Status status="in-contract" />
        </MenuItem>
    </TextField>
);
