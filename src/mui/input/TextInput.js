import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

const EMPTY_STRING = '';

class TextInput extends Component {
    handleChange(event) {
        this.props.onChange(event.currentTarget.dataset.key, event.target.value);
    }

    render() {
        const { source, label, record, options } = this.props;
        return (<TextField
            floatingLabelText={label}
            data-key={source}
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
};

TextInput.defaultProps = {
    record: {},
    options: {},
};

export default TextInput;
