import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

class LongTextInput extends Component {
    render() {
        const {
            input,
            label,
            meta: { touched, error },
            options,
        } = this.props;

        return (<TextField
            {...input}
            {...options}
            multiLine
            fullWidth
            floatingLabelText={label}
            errorText={touched && error}
        />);
    }
}

LongTextInput.propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    options: PropTypes.object,
};

LongTextInput.defaultProps = {
    options: {},
};

export default LongTextInput;
