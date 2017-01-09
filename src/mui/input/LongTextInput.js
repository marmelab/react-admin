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
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    options: PropTypes.object,
    source: PropTypes.string,
    validation: PropTypes.object,
};

LongTextInput.defaultProps = {
    addField: true,
    options: {},
};

export default LongTextInput;
