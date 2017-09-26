import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';
import FieldTitle from '../../util/FieldTitle';

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
    onChange = (_, date) => {
        this.props.input.onChange(date.toISOString());
        this.props.input.onBlur();
    };

    /**
     * This aims to fix a bug created by the conjunction of
     * redux-form, which expects onBlur to be triggered after onChange, and
     * material-ui, which triggers onBlur on <DatePicker> when the user clicks
     * on the input to bring the focus on the calendar rather than the input.
     *
     * @see https://github.com/erikras/redux-form/issues/1218#issuecomment-229072652
     */
    onBlur = () => {};

    onDismiss = () => this.props.input.onBlur();

    render() {
        const {
            input,
            isRequired,
            label,
            meta,
            options,
            source,
            elStyle,
            resource,
        } = this.props;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The DateInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/admin-on-rest/Inputs.html#writing-your-own-input-component for details."
            );
        }
        const { touched, error } = meta;

        return (
            <DatePicker
                {...input}
                errorText={touched && error}
                floatingLabelText={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                DateTimeFormat={Intl.DateTimeFormat}
                container="inline"
                autoOk
                value={datify(input.value)}
                onChange={this.onChange}
                onBlur={this.onBlur}
                onDismiss={this.onDismiss}
                style={elStyle}
                {...options}
            />
        );
    }
}

DateInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

DateInput.defaultProps = {
    addField: true,
    options: {},
};

export default DateInput;
