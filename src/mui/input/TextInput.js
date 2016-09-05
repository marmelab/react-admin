import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const EMPTY_STRING = '';

class TextInput extends Component {
    handleChange(event) {
        this.props.onChange(this.props.source, event.target.value);
    }

    render() {
        const { source, label, record, options } = this.props;
        return (<TextField
            name={source}
            floatingLabelText={label}
            value={record[source] || EMPTY_STRING}
            onChange={::this.handleChange}
            {...options}
        />);
    }
}

TextInput.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    options: PropTypes.object,
    onChange: PropTypes.func,
    includesLabel: PropTypes.bool.isRequired,
};

TextInput.defaultProps = {
    record: {},
    options: {},
    includesLabel: true,
};

export default TextInput;
