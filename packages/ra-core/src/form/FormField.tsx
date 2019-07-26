import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldProps } from 'react-final-form';
import { Validator, composeValidators } from './validate';

export const isRequired = validate => {
    if (validate && validate.isRequired) {
        return true;
    }
    if (Array.isArray(validate)) {
        return !!validate.find(it => it.isRequired);
    }
    return false;
};

interface Props extends Omit<FieldProps<any, HTMLElement>, 'validate'> {
    defaultValue?: any;
    input?: any;
    source: string;
    validate?: Validator | Validator[];
}

export const FormField: SFC<Props> = ({ input, validate, ...props }) => {
    const sanitizedValidate = Array.isArray(validate)
        ? composeValidators(validate)
        : validate;

    return input ? ( // An ancestor is already decorated by Field
        React.createElement(props.component, { input, ...props })
    ) : (
        <Field
            {...props}
            name={props.source}
            isRequired={isRequired(validate)}
            validate={sanitizedValidate}
        />
    );
};

FormField.propTypes = {
    defaultValue: PropTypes.any,
    source: PropTypes.string,
    validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
};

export default FormField;
