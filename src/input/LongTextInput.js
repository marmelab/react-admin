import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const LongTextInput = ({ source, label, record = {}, options = {}, onChange }) => <TextField
    floatingLabelText={label}
    data-key={source}
    value={record[source]}
    onChange={onChange}
    multiLine
    fullWidth
    {...options}
/>;

LongTextInput.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    onChange: PropTypes.func.isRequired,
};

export default LongTextInput;
