import React from 'react';
import { Field } from 'redux-form';

import Labeled from '../input/Labeled';
import isRequired from './isRequired';

/**
 * A helper Input component for EmbeddedArrayInput
 *
 * It's an alternative to FormField that provides the ability to prefix the source/name
 * with a string you provide
 *
 * @example
 *
 * <EmbeddedArrayInputFormField input={input} prefix={my_prefix} />
 *
 */
const EmbeddedArrayInputFormField = ({ input, prefix, ...rest }) => {
    if (input.props.addField) {
        if (input.props.addLabel) {
            return (
                <Field
                    {...rest}
                    {...input.props}
                    name={`${prefix}.${input.props.source}`}
                    component={Labeled}
                    label={input.props.label}
                    isRequired={isRequired(input.props.validate)}
                >
                    {input}
                </Field>
            );
        }
        return (
            <Field
                {...rest}
                {...input.props}
                name={`${prefix}.${input.props.source}`}
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
                source={`${prefix}.${input.props.source}`}
                isRequired={isRequired(input.props.validate)}
            >
                {input}
            </Labeled>
        );
    }
    return typeof input.type === 'string'
        ? input
        : React.cloneElement(input, rest);
};

export default EmbeddedArrayInputFormField;
