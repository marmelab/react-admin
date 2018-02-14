import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

const ReferenceError = ({ label, error }) => (
    <TextField disabled={true} hintText={label} errorText={error} />
);

ReferenceError.propTypes = {
    error: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};

export default ReferenceError;
