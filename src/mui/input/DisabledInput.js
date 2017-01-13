import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import get from 'lodash.get';
import title from '../../util/title';

const DisabledInput = ({ label, record, source }) => <TextField
    value={get(record, source)}
    floatingLabelText={title(label, source)}
    disabled
/>;

DisabledInput.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string,
};

export default DisabledInput;
