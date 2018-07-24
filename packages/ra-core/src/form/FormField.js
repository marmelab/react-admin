import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import withDefaultValue from './withDefaultValue';

export const isRequired = validate => {
    if (validate && validate.isRequired) return true;
    if (Array.isArray(validate)) {
        return !!validate.find(it => it.isRequired);
    }
    return false;
};

export const FormFieldView = ({ input, ...props }) =>
    input ? ( // An ancestor is already decorated by Field
        React.createElement(props.component, { input, ...props })
    ) : (
        <Field
            {...props}
            name={props.source}
            isRequired={isRequired(props.validate)}
        />
    );

FormFieldView.propTypes = {
    component: PropTypes.any.isRequired,
    defaultValue: PropTypes.any,
    input: PropTypes.object,
    source: PropTypes.string,
    validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
};

export default withDefaultValue(FormFieldView);
