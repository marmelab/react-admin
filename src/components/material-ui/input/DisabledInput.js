import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const DisabledInput = ({ source, label, record = {} }) => <TextField
    floatingLabelText={label}
    value={record[source]}
    disabled
/>;

DisabledInput.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    onChange: PropTypes.func.isRequired,
};

export default DisabledInput;
