import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

class TextInput extends Component {
    handleChange = (event) => {
        this.props.onChange(this.props.source, event.target.value);
    };

    render() {
        const {
            input,
            label,
            meta: { touched, error },
            options,
        } = this.props;

        return (<TextField
            floatingLabelText={label}
            errorText={touched && error}
            onChange={this.handleChange}
            {...input}
            {...options}
        />);
    }
}

TextInput.propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.object,
    meta: PropTypes.object,
};

TextInput.defaultProps = {
    options: {},
    includesLabel: true,
};

export default TextInput;
