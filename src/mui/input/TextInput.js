import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const TextInput = ({ input, label, meta: { touched, error }, options, type }) => (
    <TextField
        value={input.value}
        onChange={input.onChange}
        {...options}
        type={type}
        floatingLabelText={label}
        errorText={touched && error}
    />
);

TextInput.propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.object,
    type: PropTypes.string,
    validation: PropTypes.object,
};

TextInput.defaultProps = {
    includesLabel: true,
    options: {},
    type: 'text',
};

export default TextInput;
