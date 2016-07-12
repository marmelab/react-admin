import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const TextInput = ({ source, label, record = {}, options = {}, onChange }) => (<TextField
    floatingLabelText={label}
    data-key={source}
    value={record[source]}
    onChange={onChange}
    { ...options }
/>);

TextInput.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    options: PropTypes.object,
    onChange: PropTypes.func.isRequired,
};

export default TextInput;
