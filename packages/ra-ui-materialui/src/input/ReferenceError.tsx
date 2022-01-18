import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';

export const ReferenceError = ({
    label,
    error,
}: {
    label: string | ReactElement | false;
    error: string;
}) => <TextField error disabled label={label} value={error} margin="normal" />;

ReferenceError.propTypes = {
    error: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.bool,
    ]).isRequired,
};
