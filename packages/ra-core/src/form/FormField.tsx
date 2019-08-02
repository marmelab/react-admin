import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import { FieldProps } from 'react-final-form';
import useField from './useField';
import { Validator } from './validate';

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
    const fieldProps = useField({ validate, ...props });

    return input // An ancestor is already decorated by Field
        ? React.createElement(props.component, { input, ...props })
        : React.createElement(props.component, { ...fieldProps, ...props });
};

FormField.propTypes = {
    defaultValue: PropTypes.any,
    source: PropTypes.string,
    validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
};

export default FormField;
