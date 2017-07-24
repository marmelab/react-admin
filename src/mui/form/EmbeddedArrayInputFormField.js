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
const EmbeddedArrayInputFormField = ({ input, prefix, resource, ...rest }) => {
    const theLabel =
        input.props.label ||
        `resources.${resource}.fields.` +
            `${prefix}.${input.props.source}`
                .replace(/[^a-z.]/g, '')
                .replace(/[.]/g, '_');

    const theInput = input.props.resource
        ? input.props.resource
        : React.cloneElement(input, {
              props: {
                  ...input.props,
                  resource: resource,
              },
          });

    if (theInput.props.addField) {
        if (theInput.props.addLabel) {
            return (
                <Field
                    {...rest}
                    {...theInput.props}
                    name={`${prefix}.${theInput.props.source}`}
                    component={Labeled}
                    label={theLabel}
                    isRequired={isRequired(theInput.props.validate)}
                >
                    {theInput}
                </Field>
            );
        }
        return (
            <Field
                {...rest}
                {...theInput.props}
                name={`${prefix}.${theInput.props.source}`}
                label={theLabel}
                component={theInput.type}
                isRequired={isRequired(theInput.props.validate)}
            />
        );
    }
    if (theInput.props.addLabel) {
        return (
            <Labeled
                {...rest}
                label={theInput.props.label}
                source={`${prefix}.${theInput.props.source}`}
                isRequired={isRequired(theInput.props.validate)}
            >
                {theInput}
            </Labeled>
        );
    }
    return typeof theInput.type === 'string'
        ? theInput
        : React.cloneElement(theInput, {
              ...rest,
              source: `${prefix}.${theInput.props.source}`,
          });
};

export default EmbeddedArrayInputFormField;
