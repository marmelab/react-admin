import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import addField from '../form/addField';
import FieldTitle from '../../util/FieldTitle';

const DisabledInput = ({
    input: { value },
    label,
    resource,
    source,
    elStyle,
}) => (
    <TextField
        disabled
        margin="normal"
        value={value}
        label={<FieldTitle label={label} source={source} resource={resource} />}
        style={elStyle}
    />
);

DisabledInput.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    elStyle: PropTypes.object,
    input: PropTypes.object,
};

export default addField(DisabledInput);
