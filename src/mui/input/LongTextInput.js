import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import FieldTitle from '../../util/FieldTitle';

const LongTextInput = ({ input, label, meta: { touched, error }, options, source, elStyle, resource }) => (
    <TextField
        {...input}
        multiLine
        fullWidth
        floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
        errorText={touched && error}
        style={elStyle}
        {...options}
    />
);

LongTextInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    validation: PropTypes.object,
};

LongTextInput.defaultProps = {
    addField: true,
    options: {},
};

export default LongTextInput;
