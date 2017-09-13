import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FieldTitle from '../../util/FieldTitle';

const LongTextInput = ({
    input,
    isRequired,
    label,
    meta,
    options,
    source,
    elStyle,
    resource,
}) => {
    if (typeof meta === 'undefined') {
        throw new Error(
            "The LongTextInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/admin-on-rest/Inputs.html#writing-your-own-input-component for details."
        );
    }
    const { touched, error } = meta;

    return (
        <TextField
            {...input}
            multiLine
            fullWidth
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
};

LongTextInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    validate: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func),
    ]),
};

LongTextInput.defaultProps = {
    addField: true,
    options: {},
};

export default LongTextInput;
