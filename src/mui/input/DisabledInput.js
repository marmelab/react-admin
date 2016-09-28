import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const DisabledInput = ({ input, label }) => <TextField
    value={input.value}
    floatingLabelText={label}
    disabled
/>;

DisabledInput.propTypes = {
    includesLabel: PropTypes.bool,
    input: PropTypes.object,
    label: PropTypes.string,
};

DisabledInput.defaultProps = {
    includesLabel: true,
};

export default DisabledInput;
