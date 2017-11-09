import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import addField from '../form/addField';
import FieldTitle from '../../util/FieldTitle';

/**
 * Convert Date object to String
 * 
 * @param {Date} v value to convert
 * @returns {String} A standardized date (yyyy-MM-dd), to be passed to an <input type="date" />
 */
const dateFormatter = v => {
    if (!(v instanceof Date) || isNaN(v)) return;
    const pad = '00';
    const yyyy = v.getFullYear().toString();
    const MM = (v.getMonth() + 1).toString();
    const dd = v.getDate().toString();
    return `${yyyy}-${(pad + MM).slice(-2)}-${(pad + dd).slice(-2)}`;
};

export class DateInput extends Component {
    onChange = event => {
        this.props.input.onChange(event.target.value);
    };

    render() {
        const {
            classes,
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
                "The DateInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
            );
        }
        const { touched, error } = meta;

        return (
            <TextField
                {...input}
                type="date"
                margin="normal"
                error={!!(touched && error)}
                helperText={touched && error}
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                InputLabelProps={{
                    shrink: true,
                }}
                value={
                    input.value instanceof Date
                        ? dateFormatter(input.value)
                        : input.value
                }
                onChange={this.onChange}
                onBlur={this.onBlur}
                classes={classes}
                style={elStyle}
                {...options}
            />
        );
    }
}

DateInput.propTypes = {
    classes: PropTypes.object,
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
    options: {},
};

export default addField(DateInput);
