import * as React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/material/styles';
import clsx from 'clsx';

import { Status } from '../misc/Status';

const useStyles = makeStyles({
    root: {
        width: 150,
    },
});

export const StatusSelector = ({ status, setStatus, className = '' }: any) => {
    const classes = useStyles();
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
            className={clsx(className, classes.root)}
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
};
