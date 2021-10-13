import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';

export const ReferenceError = ({ label, error }) => (
    <TextField error disabled label={label} value={error} margin="normal" />
);

ReferenceError.propTypes = {
    error: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};
