import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';

const datify = input => {
    if (!input) {
        return null;
    }

    return (input instanceof Date ? input : new Date(input));
};

class DateInput extends Component {
    _onChange = (_, date) => this.props.input.onChange(date);

    render() {
        const { input, options, label, locale } = this.props;

        return (<DatePicker
            {...input}
            {...options}
            floatingLabelText={label}
            locale={locale}
            DateTimeFormat={Intl.DateTimeFormat}
            container="inline"
            autoOk
            value={datify(input.value)}
            onChange={this._onChange}
            format="dd/mm/YYYY"
        />);
    }
}

DateInput.propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    locale: PropTypes.string.isRequired,
    options: PropTypes.object,
};

DateInput.defaultProps = {
    options: {},
    locale: 'en-US',
};

export default DateInput;
