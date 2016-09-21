import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const DisabledInput = ({ input, label }) => <TextField
    {...input}
    floatingLabelText={label}
    disabled
/>;

DisabledInput.propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
};

DisabledInput.defaultProps = {
};

export default DisabledInput;
