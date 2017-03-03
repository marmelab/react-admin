import React, { PropTypes } from 'react';
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
const TextInput = ({ input, label, meta: { touched, error }, options, type, source, elStyle, resource }) => (
    <TextField
        {...input}
        type={type}
        floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
        errorText={touched && error}
        style={elStyle}
        {...options}
    />
);

TextInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    type: PropTypes.string,
    validation: PropTypes.object,
};

TextInput.defaultProps = {
    addField: true,
    options: {},
    type: 'text',
};

export default TextInput;
