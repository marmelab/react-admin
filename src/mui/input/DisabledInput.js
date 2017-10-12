import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FieldTitle from '../../util/FieldTitle';

const DisabledInput = ({
    input: { value },
    label,
    resource,
    source,
    elStyle,
}) => (
    <TextField
        value={value}
        floatingLabelText={
            <FieldTitle label={label} source={source} resource={resource} />
        }
        style={elStyle}
        disabled
    />
);

DisabledInput.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    addField: PropTypes.bool.isRequired,
};

DisabledInput.defaultProps = {
    addField: true,
};

export default DisabledInput;
