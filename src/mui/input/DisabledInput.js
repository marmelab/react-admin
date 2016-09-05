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
    includesLabel: PropTypes.bool.isRequired,
};

DisabledInput.defaultProps = {
    includesLabel: true,
};

export default DisabledInput;
