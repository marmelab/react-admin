import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import title from '../../util/title';

const LongTextInput = ({ input, label, meta: { touched, error }, options, source, elStyle }) => (
    <TextField
        {...input}
        multiLine
        fullWidth
        floatingLabelText={title(label, source)}
        errorText={touched && error}
        style={elStyle}
        {...options}
    />
);

LongTextInput.propTypes = {
    elStyle: PropTypes.object,
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    options: PropTypes.object,
    requiresField: PropTypes.bool.isRequired,
    source: PropTypes.string,
    validation: PropTypes.object,
};

LongTextInput.defaultProps = {
    includesLabel: true,
    options: {},
    requiresField: true,
};

export default LongTextInput;
