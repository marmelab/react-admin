import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';

class DateInput extends Component {
    handleChange(event, date) {
        this.props.onChange(this.props.source, date.toISOString());
    }

    render() {
        const { source, label, record, locale, options } = this.props;
        let date = null;
        if (record[source] instanceof Date) {
            date = record[source];
        } else if (record[source]) {
            date = new Date(record[source]);
        }
        return (<DatePicker
            floatingLabelText={label}
            locale={locale}
            DateTimeFormat={Intl.DateTimeFormat}
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
    locale: PropTypes.string.isRequired,
    options: PropTypes.object,
    onChange: PropTypes.func,
    includesLabel: PropTypes.bool.isRequired,
};

DateInput.defaultProps = {
    record: {},
    options: {},
    locale: 'en-US',
    includesLabel: true,
};

export default DateInput;
