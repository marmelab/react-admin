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
    handleBlur = (eventOrValue) => {
        this.props.onBlur(eventOrValue);
        this.props.input.onBlur(eventOrValue);

        /**
         * Necessary because of a React bug on <input type="number">
         * @see https://github.com/facebook/react/issues/1425
         */
        const value = parseFloat(this.props.input.value);
        this.handleChange(isNaN(value) ? undefined : value);
    }

    handleFocus = (event) => {
        this.props.onFocus(event);
        this.props.input.onFocus(event);
    }

    handleChange = (eventOrValue) => {
        this.props.onChange(eventOrValue);
        this.props.input.onChange(eventOrValue);
    }

    render() {
        const { elStyle, input, label, meta: { touched, error }, options, source, step, resource } = this.props;
        return (
            <TextField
                {...input}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
                type="number"
                step={step}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
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
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    step: PropTypes.string.isRequired,
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
