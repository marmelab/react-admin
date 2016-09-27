import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

class TextInput extends Component {
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
            floatingLabelText={label}
            errorText={touched && error}
        />);
    }
}

TextInput.propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.object,
    validation: PropTypes.object,
};

TextInput.defaultProps = {
    options: {},
    includesLabel: true,
};

export default TextInput;
