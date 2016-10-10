import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import title from '../../util/title';

export const datify = input => {
    if (!input) {
        return null;
    }

    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date)) {
        throw new Error(`Invalid date: ${input}`);
    }

    return date;
};

class DateInput extends Component {
    onChange = (_, date) => this.props.input.onChange(date);

    render() {
        const { input, label, meta: { touched, error }, options, source } = this.props;

        return (<DatePicker
            {...input}
            errorText={touched && error}
            floatingLabelText={title(label, source)}
            DateTimeFormat={Intl.DateTimeFormat}
            container="inline"
            autoOk
            value={datify(input.value)}
            onChange={this.onChange}
            {...options}
        />);
    }
}

DateInput.propTypes = {
    includesLabel: PropTypes.bool,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    source: PropTypes.string.isRequired,
};

DateInput.defaultProps = {
    includesLabel: true,
    options: {},
};

export default DateInput;
