import * as React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
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

interface Props
    extends Omit<
        FieldProps<any, FieldRenderProps<any, HTMLElement>, HTMLElement>,
        'validate'
    > {
    defaultValue?: any;
    input?: any;
    source: string;
    validate?: Validator | Validator[];
}

const FormField = (props: Props) => {
    const { id, input, validate, ...rest } = props;
    if (process.env.NODE_ENV !== 'production') {
        console.log('FormField is deprecated, use the useInput hook instead.');
    }

    const sanitizedValidate = Array.isArray(validate)
        ? composeValidators(validate)
        : validate;

    const finalId = id || rest.source;

    return input ? ( // An ancestor is already decorated by Field
        React.createElement(rest.component, { input, id: finalId, ...rest })
    ) : (
        <Field
            {...rest}
            id={finalId}
            name={rest.source}
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
