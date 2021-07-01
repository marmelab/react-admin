import { useCallback, ChangeEvent, FocusEvent, useEffect } from 'react';
import {
    useField as useFinalFormField,
    FieldProps,
    FieldRenderProps,
    FieldInputProps,
    useForm,
} from 'react-final-form';
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

    const { input, meta } = useFinalFormField(finalName, {
        initialValue,
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

    // Every time the record changes and didn't include a value for this field
    const form = useForm();
    const recordId = record?.id;
    useEffect(() => {
        if (input.value != null && input.value !== '') {
            return;
        }
        // Apply the default value if provided
        // We use a change here which will make the form dirty but this is expected
        // and identical to what FinalForm does (https://final-form.org/docs/final-form/types/FieldConfig#defaultvalue)
        if (defaultValue != null) {
            form.change(source, defaultValue);
        }

        if (initialValue != null) {
            form.batch(() => {
                form.change(source, initialValue);
                form.resetFieldState(source);
            });
        }
    }, [recordId, input.value, defaultValue, initialValue, source, form]);

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
