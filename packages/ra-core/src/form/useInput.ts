import {
    useField as useFinalFormField,
    FieldProps,
    FieldRenderProps,
    FieldInputProps,
} from 'react-final-form';
import { Validator, composeValidators } from './validate';
import isRequired from './isRequired';
import { useCallback, ChangeEvent, FocusEvent } from 'react';

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
}

export interface UseInputValue extends FieldRenderProps<any, HTMLElement> {
    id: string;
    isRequired: boolean;
}

const useInput = ({
    defaultValue,
    id,
    name,
    source,
    validate,
    onBlur: customOnBlur,
    onChange: customOnChange,
    onFocus: customOnFocus,
    ...options
}: InputProps): UseInputValue => {
    const finalName = name || source;

    const sanitizedValidate = Array.isArray(validate)
        ? composeValidators(validate)
        : validate;

    const { input, meta } = useFinalFormField(finalName, {
        initialValue: defaultValue,
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
            isRequired: isRequired(validate),
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
        isRequired: isRequired(validate),
    };
};

export default useInput;
