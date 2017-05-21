import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import get from 'lodash.get';
import FieldTitle from '../../util/FieldTitle';

const DisabledInput = ({ label, record, resource, source, elStyle }) => <TextField
    value={get(record, source)}
    floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
    style={elStyle}
    disabled
/>;

DisabledInput.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    elStyle: PropTypes.object,
};

export default DisabledInput;
