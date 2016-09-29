import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const LongTextInput = ({ input, label, meta: { touched, error }, options }) => (
    <TextField
        {...options}
        {...input}
        multiLine
        fullWidth
        floatingLabelText={label}
        errorText={touched && error}
    />
);

LongTextInput.propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    options: PropTypes.object,
    validation: PropTypes.object,
};

LongTextInput.defaultProps = {
    includesLabel: true,
    options: {},
};

export default LongTextInput;
