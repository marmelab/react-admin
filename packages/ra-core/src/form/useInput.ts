import { useCallback, ChangeEvent, FocusEvent, useEffect } from 'react';
import {
    useField as useFinalFormField,
    FieldProps,
    FieldRenderProps,
    FieldInputProps,
} from 'react-final-form';
import get from 'lodash/get';
import { Validator, composeValidators } from './validate';
import isRequired from './isRequired';
import { useFormGroupContext } from './useFormGroupContext';
import { useFormContext } from './useFormContext';
import { useRecordContext } from '../controller';

export interface InputProps<T = any>
    extends Omit<
        FieldProps<any, FieldRenderProps<any, HTMLElement>, HTMLElement>,
        'validate' | 'children'
    > {
    defaultValue?: any;
    id?: string;
    input?: FieldInputProps<any, HTMLElement>;
    meta?: any;
    name?: string;
    onBlur?: (event: FocusEvent<T>) => void;
    onChange?: (event: ChangeEvent | any) => void;
    onFocus?: (event: FocusEvent<T>) => void;
    options?: T;
    resource?: string;
    source: string;
    validate?: Validator | Validator[];
    isRequired?: boolean;
}

export interface UseInputValue extends FieldRenderProps<any, HTMLElement> {
    id: string;
    isRequired: boolean;
}

const useInput = ({
    defaultValue,
    initialValue,
    id,
    name,
    source,
    validate,
    onBlur: customOnBlur,
    onChange: customOnChange,
    onFocus: customOnFocus,
    isRequired: isRequiredOption,
    ...options
}: InputProps): UseInputValue => {
    const finalName = name || source;
    const formGroupName = useFormGroupContext();
    const formContext = useFormContext();
    const record = useRecordContext();

    useEffect(() => {
        if (!formContext || !formGroupName) {
            return;
        }
        formContext.registerField(source, formGroupName);

        return () => {
            formContext.unregisterField(source, formGroupName);
        };
    }, [formContext, formGroupName, source]);

    const sanitizedValidate = Array.isArray(validate)
        ? composeValidators(validate)
        : validate;

    // Fetch the initialValue from the record if available or apply the provided initialValue.
    // This ensure dynamically added inputs have their value set correctly (ArrayInput for example).
    // We don't do this for the form level initialValues so that it works as it should in final-form
    // (ie. field level initialValue override form level initialValues for this field).
    const { input, meta } = useFinalFormField(finalName, {
        initialValue: get(record, source, initialValue),
        defaultValue,
        validate: sanitizedValidate,
        ...options,
    });

    // Extract the event handlers so that we can provide ours
    // allowing users to provide theirs without breaking the form
    const { onBlur, onChange, onFocus, ...inputProps } = input;

    const handleBlur = useCallback(
        event => {
            onBlur(event);
            if (typeof customOnBlur === 'function') {
                customOnBlur(event);
            }
        },
        [onBlur, customOnBlur]
    );

    const handleChange = useCallback(
        event => {
            onChange(event);
            if (typeof customOnChange === 'function') {
                customOnChange(event);
            }
        },
        [onChange, customOnChange]
    );

    const handleFocus = useCallback(
        event => {
            onFocus(event);
            if (typeof customOnFocus === 'function') {
                customOnFocus(event);
            }
        },
        [onFocus, customOnFocus]
    );

    // If there is an input prop, this input has already been enhanced by final-form
    // This is required in for inputs used inside other inputs (such as the SelectInput inside a ReferenceInput)
    if (options.input) {
        return {
            id: id || source,
            input: options.input,
            meta: options.meta,
            isRequired: isRequiredOption || isRequired(validate),
        };
    }

    return {
        id: id || source,
        input: {
            ...inputProps,
            onBlur: handleBlur,
            onChange: handleChange,
            onFocus: handleFocus,
        },
        meta,
        isRequired: isRequiredOption || isRequired(validate),
    };
};

export default useInput;
