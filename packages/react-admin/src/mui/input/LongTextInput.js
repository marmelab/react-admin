import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import addField from '../form/addField';
import FieldTitle from '../../util/FieldTitle';

export const LongTextInput = ({
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
            "The LongTextInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
        );
    }
    const { touched, error } = meta;

    return (
        <TextField
            {...input}
            multiline
            fullWidth
            margin="normal"
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            error={error}
            helperText={touched && error}
            style={elStyle}
            {...options}
        />
    );
};

LongTextInput.propTypes = {
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
    options: {},
};

export default addField(LongTextInput);
