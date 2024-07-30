import * as React from 'react';
import { ReactElement } from 'react';
import TextField from '@mui/material/TextField';

export const ReferenceError = ({
    label,
    error,
}: {
    label?: string | ReactElement | false;
    error: Error;
}) => (
    <TextField
        error
        disabled
        label={label}
        helperText={error?.message}
        margin="normal"
    />
);
