import React, { cloneElement, Children, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isRequired, FieldTitle } from 'ra-core';
import { useFieldArray } from 'react-final-form-arrays';
import lodashIsEqual from 'lodash/isEqual';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import sanitizeRestProps from './sanitizeRestProps';
import { useForm } from 'react-final-form';

/**
 * To edit arrays of data embedded inside a record, <ArrayInput> creates a list of sub-forms.
 *
 *  @example
 *
 *      import { ArrayInput, SimpleFormIterator, DateInput, UrlInput } from 'react-admin';
 *
 *      <ArrayInput source="backlinks">
 *          <SimpleFormIterator>
 *              <DateInput source="date" />
 *              <UrlInput source="url" />
 *          </SimpleFormIterator>
 *      </ArrayInput>
 *
 * <ArrayInput> allows the edition of embedded arrays, like the backlinks field
 * in the following post record:
 *
 * {
 *   id: 123
 *   backlinks: [
 *         {
 *             date: '2012-08-10T00:00:00.000Z',
 *             url: 'http://example.com/foo/bar.html',
 *         },
 *         {
 *             date: '2012-08-14T00:00:00.000Z',
 *             url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
 *         }
 *    ]
 * }
 *
 * <ArrayInput> expects a single child, which must be a *form iterator* component.
 * A form iterator is a component accepting a fields object
 * as passed by react-final-form's <FieldArray> component, and defining a layout for
 * an array of fields. For instance, the <SimpleFormIterator> component
 * displays an array of fields in an unordered list (<ul>), one sub-form by
 * list item (<li>). It also provides controls for adding and removing
 * a sub-record (a backlink in this example).
 *
 * @see https://redux-form.com/7.3.0/examples/fieldarrays/
 */
export const ArrayInput = ({
    className,
    defaultValue,
    label,
    children,
    record,
    resource,
    source,
    validate,
    ...rest
}) => {
    const form = useForm();
    const fieldProps = useFieldArray(source);

    // HACK: This useEffect runs only once and will emulate defaultValue support on the ArrayInput
    // This is needed because defaultValue is not supported on FieldArray in react-final-form
    // NOTE: This can probably be better implemented with a mutator
    useEffect(() => {
        if (
            fieldProps.meta.pristine &&
            defaultValue &&
            !lodashIsEqual(fieldProps.fields.value, defaultValue)
        ) {
            if (
                !Array.isArray(defaultValue) &&
                process.env.NODE_ENV !== 'production'
            ) {
                console.warn('<ArrayInput> defaultValue must be an array');
                return;
            }

            // As we may have multiple items in the defaultValue, we batch the form changes for better performances
            form.batch(() => {
                defaultValue.forEach(value => fieldProps.fields.push(value));
            });
        }
    }, []); // eslint-disable-line

    return (
        <FormControl
            fullWidth
            margin="normal"
            className={className}
            {...sanitizeRestProps(rest)}
        >
            <InputLabel htmlFor={source} shrink>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired(validate)}
                />
            </InputLabel>
            {cloneElement(Children.only(children), {
                ...fieldProps,
                record,
                resource,
                source,
            })}
        </FormControl>
    );
};

ArrayInput.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    defaultValue: PropTypes.any,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    record: PropTypes.object,
    options: PropTypes.object,
    validate: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func),
    ]),
};

ArrayInput.defaultProps = {
    options: {},
    fullWidth: true,
};
export default ArrayInput;
