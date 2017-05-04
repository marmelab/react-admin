import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FieldTitle from '../../util/FieldTitle';

/**
 * An Input component for a string
 *
 * @example
 * <TextInput source="first_name" />
 *
 * You can customize the `type` props (which defaults to "text").
 * Note that, due to a React bug, you should use `<NumberField>` instead of using type="number".
 * @example
 * <TextInput source="email" type="email" />
 * <NumberInput source="nb_views" />
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 */
export class TextInput extends Component {
    handleBlur = (eventOrValue) => {
        this.props.onBlur(eventOrValue);
        this.props.input.onBlur(eventOrValue);
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
        const {
            elStyle,
            input,
            label,
            meta: { touched, error },
            options,
            resource,
            source,
            type,
        } = this.props;

        return (
            <TextField
                {...input}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
                type={type}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
                errorText={touched && error}
                style={elStyle}
                {...options}
            />
        );
    }
}

TextInput.propTypes = {
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
    type: PropTypes.string,
    validate: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
};

TextInput.defaultProps = {
    addField: true,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: {},
    type: 'text',
};

export default TextInput;
