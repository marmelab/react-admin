import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import title from '../../util/title';

export const datify = input => {
    if (!input) {
        return null;
    }

    let date = input instanceof Date ? input : new Date(input.replace('-','/','g'));
    if (isNaN(date)) {
        throw new Error(`Invalid date: ${input}`);
    }

    return date;
};

class DateInput extends Component {
    onChange = (_, date) => this.props.input.onChange(date);

    render() {
        const { input, label, meta: { touched, error }, options, source, elStyle } = this.props;
        return (<DatePicker
            {...input}
            errorText={touched && error}
            floatingLabelText={title(label, source)}
            DateTimeFormat={Intl.DateTimeFormat}
            container="inline"
            autoOk
            value={datify(input.value)}
            onChange={this.onChange}
            style={elStyle}
            {...options}
        />);
    }
}

DateInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    source: PropTypes.string,
};

DateInput.defaultProps = {
    addField: true,
    options: {},
};

export default DateInput;
