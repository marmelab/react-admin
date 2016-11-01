import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import title from '../../util/title';

const LongTextInput = ({ input, label, meta: { touched, error }, options, source, style }) => (
    <TextField
        {...input}
        multiLine
        fullWidth
        floatingLabelText={title(label, source)}
        errorText={touched && error}
        style={style}
        {...options}
    />
);

LongTextInput.propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    options: PropTypes.object,
    source: PropTypes.string.isRequired,
    style: PropTypes.object,
    validation: PropTypes.object,
};

LongTextInput.defaultProps = {
    includesLabel: true,
    options: {},
};

export default LongTextInput;
