import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import title from '../../util/title';

const DisabledInput = ({ input, label, source }) => <TextField
    value={input.value}
    floatingLabelText={title(label, source)}
    disabled
/>;

DisabledInput.propTypes = {
    includesLabel: PropTypes.bool,
    input: PropTypes.object,
    label: PropTypes.string,
    source: PropTypes.string.isRequired,
};

DisabledInput.defaultProps = {
    includesLabel: true,
};

export default DisabledInput;
