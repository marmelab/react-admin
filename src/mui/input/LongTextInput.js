import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

class LongTextInput extends Component {
    handleChange(event) {
        this.props.onChange(event.currentTarget.dataset.key, event.target.value);
    }

    render() {
        const { source, label, record, options } = this.props;
        return (<TextField
            floatingLabelText={label}
            data-key={source}
            value={record[source]}
            onChange={::this.handleChange}
            multiLine
            fullWidth
            {...options}
        />);
    }
}

LongTextInput.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    options: PropTypes.object,
    onChange: PropTypes.func,
    includesLabel: PropTypes.bool.isRequired,
};

LongTextInput.defaultProps = {
    record: {},
    options: {},
    includesLabel: true,
};

export default LongTextInput;
