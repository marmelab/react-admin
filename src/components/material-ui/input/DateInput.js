import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';

class DateInput extends Component {
    handleChange(event, date) {
        this.props.onChange(this.props.source, date);
    }

    render() {
        const { source, label, record, options } = this.props;
        let date = null;
        if (record[source] instanceof Date) {
            date = record[source];
        } else if (record[source]) {
            date = new Date(record[source]);
        }
        return (<DatePicker
            floatingLabelText={label}
            value={date}
            onChange={::this.handleChange}
            container="inline"
            autoOk
            {...options}
        />);
    }
}

DateInput.propTypes = {
    source: PropTypes.string.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    options: PropTypes.object,
    onChange: PropTypes.func,
};

DateInput.defaultProps = {
    record: {},
    options: {},
};

export default DateInput;
