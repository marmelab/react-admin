import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FieldTitle from '../../util/FieldTitle';

const DisabledInput = ({ label, input, resource, source, elStyle }) => (
    <TextField
        value={input.value}
        floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
        style={elStyle}
        disabled
    />
);

DisabledInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    elStyle: PropTypes.object,
};

DisabledInput.defaultProps = {
    addField: true,
};

export default DisabledInput;
