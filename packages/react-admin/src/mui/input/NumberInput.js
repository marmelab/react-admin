import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import FieldTitle from '../../util/FieldTitle';
import addField from '../form/addField';

/**
 * An Input component for a number
 *
 * @example
 * <NumberInput source="nb_views" />
 *
 * You can customize the `step` props (which defaults to "any")
 * @example
 * <NumberInput source="nb_views" step={1} />
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 */
export class NumberInput extends Component {
    handleBlur = eventOrValue => {
        this.props.onBlur(eventOrValue);
        this.props.input.onBlur(eventOrValue);

        /**
         * Necessary because of a React bug on <input type="number">
         * @see https://github.com/facebook/react/issues/1425
         */
        const value = parseFloat(this.props.input.value);
        this.handleChange(isNaN(value) ? undefined : value);
    };

    handleFocus = event => {
        this.props.onFocus(event);
        this.props.input.onFocus(event);
    };

    handleChange = eventOrValue => {
        this.props.onChange(eventOrValue);
        this.props.input.onChange(eventOrValue);
    };

    render() {
        const {
            className,
            elStyle,
            input,
            isRequired,
            label,
            meta,
            options,
            source,
            step,
            resource,
        } = this.props;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The NumberInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
            );
        }
        const { touched, error } = meta;

        return (
            <TextField
                {...input}
                type="number"
                margin="normal"
                error={!!(touched && error)}
                helperText={touched && error}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
                step={step}
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                className={className}
                style={elStyle}
                {...options}
            />
        );
    }
}

NumberInput.propTypes = {
    className: PropTypes.string,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    validate: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func),
    ]),
};

NumberInput.defaultProps = {
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: {},
    step: 'any',
};

export default addField(NumberInput);
