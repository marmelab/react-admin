import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
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

ReferenceError.propTypes = {
    error: PropTypes.object.isRequired,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.bool,
    ]),
};
