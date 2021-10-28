import * as React from 'react';
import { cloneElement, Children, FC, ReactElement, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    isRequired,
    FieldTitle,
    // composeSyncValidators,
    useDeepCompareEffect,
} from 'ra-core';
import {
    useFieldArray,
    useFormContext as useReactHookFormContext,
} from 'react-hook-form';
import { InputLabel, FormControl } from '@mui/material';
// import { InputLabel, FormControl, FormHelperText } from '@mui/material';

import { LinearProgress } from '../../layout';
// import { InputHelperText } from '../InputHelperText';
import { sanitizeInputRestProps } from '../sanitizeInputRestProps';
import { Labeled } from '../Labeled';
import { InputProps } from '../types';
import { ArrayInputContext } from './ArrayInputContext';

/**
 * To edit arrays of data embedded inside a record, <ArrayInput> creates a list of sub-forms.
 *
 *  @example
 *
 *      import { ArrayInput, SimpleFormIterator, DateInput, TextInput } from 'react-admin';
 *
 *      <ArrayInput source="backlinks">
 *          <SimpleFormIterator>
 *              <DateInput source="date" />
 *              <TextInput source="url" />
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
 * A form iterator is a component accepting a fields object as passed by
 * react-hook-form, and defining a layout for an array of fields.
 * For instance, the <SimpleFormIterator> component displays an array of fields
 * in an unordered list (<ul>), one sub-form by list item (<li>). It also
 * provides controls for adding and removing a sub-record (a backlink in this
 * example).
 */
export const ArrayInput: FC<ArrayInputProps> = ({
    className,
    defaultValue,
    label,
    loaded,
    loading,
    children,
    helperText,
    record,
    resource,
    source,
    validate,
    variant,
    disabled,
    margin = 'dense',
    ...rest
}) => {
    const initialDefaultValues = useRef();
    // const sanitizedValidate = Array.isArray(validate)
    //     ? composeSyncValidators(validate)
    //     : validate;

    const form = useReactHookFormContext();
    const fieldProps = useFieldArray({ name: source });

    useDeepCompareEffect(() => {
        initialDefaultValues.current = defaultValue;
        if (defaultValue) {
            form.reset({ ...form.getValues(), [source]: defaultValue });
        }
    }, [defaultValue]);

    if (loading) {
        return (
            <Labeled
                // @ts-ignore
                label={label}
                source={source}
                resource={resource}
                className={className}
                margin={margin}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    // const { error, submitError, touched, dirty } = fieldProps.meta;
    // const arrayInputError = getArrayInputError(error || submitError);

    return (
        <FormControl
            fullWidth
            margin="normal"
            className={className}
            // error={(touched || dirty) && !!arrayInputError}
            {...sanitizeInputRestProps(rest)}
        >
            {label !== false ? (
                <InputLabel
                    htmlFor={source}
                    shrink
                    // error={(touched || dirty) && !!arrayInputError}
                >
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired(validate)}
                    />
                </InputLabel>
            ) : null}
            <ArrayInputContext.Provider value={fieldProps}>
                {cloneElement(Children.only(children), {
                    ...fieldProps,
                    record,
                    resource,
                    source,
                    variant,
                    margin,
                    disabled,
                })}
            </ArrayInputContext.Provider>
            {/* {!!((touched || dirty) && arrayInputError) || helperText ? (
                <FormHelperText error={(touched || dirty) && !!arrayInputError}>
                    <InputHelperText
                        touched={touched || dirty}
                        error={arrayInputError}
                        helperText={helperText}
                    />
                </FormHelperText>
            ) : null} */}
        </FormControl>
    );
};

ArrayInput.propTypes = {
    // @ts-ignore
    children: PropTypes.node,
    className: PropTypes.string,
    defaultValue: PropTypes.any,
    isRequired: PropTypes.bool,
    // @ts-ignore
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.element,
    ]),
    helperText: PropTypes.string,
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

export const getArrayInputError = error => {
    if (Array.isArray(error)) {
        return undefined;
    }
    return error;
};

export interface ArrayInputProps extends InputProps {
    className?: string;
    children: ReactElement;
    loaded?: boolean;
    loading?: boolean;
    record?: any;
}
