import * as React from 'react';
import { cloneElement, Children, ReactElement, useEffect, useRef } from 'react';
import clsx from 'clsx';
import {
    isRequired,
    FieldTitle,
    composeSyncValidators,
    RaRecord,
    useApplyInputDefaultValues,
    useGetValidationErrorMessage,
    useResourceContext,
} from 'ra-core';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { InputLabel, FormControl, FormHelperText } from '@mui/material';
import isEqual from 'lodash/isEqual';

import { LinearProgress } from '../../layout';
import { CommonInputProps } from '../CommonInputProps';
import { InputHelperText } from '../InputHelperText';
import { sanitizeInputRestProps } from '../sanitizeInputRestProps';
import { Labeled } from '../../Labeled';
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
 * react-hook-form-arrays's useFieldArray() hook, and defining a layout for
 * an array of fields. For instance, the <SimpleFormIterator> component
 * displays an array of fields in an unordered list (<ul>), one sub-form by
 * list item (<li>). It also provides controls for adding and removing
 * a sub-record (a backlink in this example).
 *
 * @see {@link https://react-hook-form.com/api/usefieldarray}
 */
export const ArrayInput = (props: ArrayInputProps) => {
    const {
        className,
        defaultValue,
        label,
        isFetching,
        isLoading,
        children,
        helperText,
        record,
        source,
        validate,
        variant,
        disabled,
        margin = 'dense',
        ...rest
    } = props;
    const sanitizedValidate = Array.isArray(validate)
        ? composeSyncValidators(validate)
        : validate;
    const getValidationErrorMessage = useGetValidationErrorMessage();
    const resource = useResourceContext(props);

    const fieldProps = useFieldArray({
        name: source,
    });

    const {
        getFieldState,
        clearErrors,
        formState,
        getValues,
        register,
        setError,
        unregister,
    } = useFormContext();

    const { isSubmitted } = formState;

    // We need to register the array itself as a field to enable validation at its level
    useEffect(() => {
        register(source);

        return () => {
            unregister(source, { keepValue: true });
        };
    }, [register, unregister, source]);

    useApplyInputDefaultValues(props);

    const value = useWatch({ name: source });
    const { isDirty, invalid, error } = getFieldState(source, formState);

    // As react-hook-form does not handle validation on the array itself,
    // we need to do it manually
    const errorRef = useRef(null);
    useEffect(() => {
        const applyValidation = async () => {
            const newError = await sanitizedValidate(value, getValues(), props);
            if (newError && !isEqual(errorRef.current, newError)) {
                errorRef.current = newError;
                setError(source, {
                    type: 'manual',
                    message: getValidationErrorMessage(newError),
                });
            }

            if (!newError && error) {
                errorRef.current = null;
                clearErrors(source);
            }
        };

        if (sanitizedValidate) {
            applyValidation();
        }
    }, [
        clearErrors,
        error,
        sanitizedValidate,
        value,
        getValues,
        props,
        setError,
        source,
        getValidationErrorMessage,
    ]);

    if (isLoading) {
        return (
            <Labeled label={label} className={className}>
                <LinearProgress />
            </Labeled>
        );
    }

    return (
        <FormControl
            fullWidth
            margin="normal"
            className={clsx('ra-input', `ra-input-${source}`, className)}
            error={(isDirty || isSubmitted) && invalid}
            {...sanitizeInputRestProps(rest)}
        >
            <InputLabel
                htmlFor={source}
                shrink
                error={(isDirty || isSubmitted) && invalid}
            >
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired(validate)}
                />
            </InputLabel>
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
            {!!((isDirty || isSubmitted) && invalid) || helperText ? (
                <FormHelperText error={(isDirty || isSubmitted) && invalid}>
                    <InputHelperText
                        touched={isDirty || isSubmitted}
                        error={error?.message}
                        helperText={helperText}
                    />
                </FormHelperText>
            ) : null}
        </FormControl>
    );
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

export type ArrayInputProps = CommonInputProps & {
    className?: string;
    children: ReactElement;
    disabled?: boolean;
    isFetching?: boolean;
    isLoading?: boolean;
    record?: Partial<RaRecord>;
};
