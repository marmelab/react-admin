import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

class TextInput extends Component {
    render() {
        const {
            input,
            label,
            meta: { touched, error },
            options,
            type,
        } = this.props;

        return (<TextField
            {...input}
            {...options}
            type={type}
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
    type: PropTypes.string,
    validation: PropTypes.object,
};

TextInput.defaultProps = {
    includesLabel: true,
    options: {},
    type: 'text',
};

export default TextInput;
