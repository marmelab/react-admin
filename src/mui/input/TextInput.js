import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import title from '../../util/title';

const TextInput = ({ input, label, meta: { touched, error }, options, type, source }) => (
    <TextField
        value={input.value}
        onChange={input.onChange}
        {...options}
        type={type}
        floatingLabelText={title(label, source)}
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
    source: PropTypes.string.isRequired,
    type: PropTypes.string,
    validation: PropTypes.object,
};

TextInput.defaultProps = {
    includesLabel: true,
    options: {},
    type: 'text',
};

export default TextInput;
