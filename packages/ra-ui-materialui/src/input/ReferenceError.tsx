import * as React from 'react';
import { ReactNode } from 'react';
import TextField from '@mui/material/TextField';

// @deprecated
export const ReferenceError = ({
    label,
    error,
}: {
    label?: ReactNode;
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
