import React from 'react';
import { Field } from 'redux-form';

import Labeled from '../input/Labeled';
import { required } from './validate';

const isRequired = (validate) => {
    if (validate === required) return true;
    if (Array.isArray(validate)) {
        return validate.includes(required);
    }
    return false;
};

const FormField = ({ input, ...rest }) => {
    if (input.props.addField) {
        if (input.props.addLabel) {
            return (
                <Field
                    {...rest}
                    {...input.props}
                    name={input.props.source}
                    component={Labeled}
                    label={input.props.label}
                    isRequired={isRequired(input.props.validate)}
                >
                    { input }
                </Field>
            );
        }
        return (
            <Field
                {...rest}
                {...input.props}
                name={input.props.source}
                component={input.type}
                isRequired={isRequired(input.props.validate)}
            />
        );
    }
    if (input.props.addLabel) {
        return (
            <Labeled
                {...rest}
                label={input.props.label}
                source={input.props.source}
                isRequired={isRequired(input.props.validate)}
            >
                {input}
            </Labeled>
        );
    }
    return (typeof input.type === 'string') ? input : React.cloneElement(input, rest);
};

export default FormField;
