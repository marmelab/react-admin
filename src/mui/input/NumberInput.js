import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FieldTitle from '../../util/FieldTitle';

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
class NumberInput extends Component {
    handleBlur = () => {
        /**
         * Necessary because of a React bug on <input type="number">
         * @see https://github.com/facebook/react/issues/1425
         */
        const value = isNaN(parseFloat(this.props.input.value))
            ? null
            : parseFloat(this.props.input.value);
        this.props.onBlur(value);
        this.props.input.onBlur(value);
    };

    handleFocus = event => {
        this.props.onFocus(event);
        this.props.input.onFocus(event);
    };

    handleChange = (event, newValue) => {
        /**
         * Necessary because of a React bug on <input type="number">
         * @see https://github.com/facebook/react/issues/1425
         */
        const value = isNaN(parseFloat(newValue)) ? null : parseFloat(newValue);
        this.props.onChange(value);
        this.props.input.onChange(value);
    };

    render() {
        const {
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
                "The NumberInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/admin-on-rest/Inputs.html#writing-your-own-input-component for details."
            );
        }
        const { touched, error } = meta;

        return (
            <TextField
                {...input}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
                type="number"
                step={step}
                floatingLabelText={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                errorText={touched && error}
                style={elStyle}
                {...options}
            />
        );
    }
}

NumberInput.propTypes = {
    addField: PropTypes.bool.isRequired,
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
    addField: true,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: {},
    step: 'any',
};

export default NumberInput;
