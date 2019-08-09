import {
    useField as useFinalFormField,
    FieldProps as FinalFormFieldProps,
    FieldRenderProps,
} from 'react-final-form';
import { Validator, composeValidators } from './validate';
import isRequired from './isRequired';
import { useCallback, ChangeEvent } from 'react';

export interface InputProps
    extends Omit<
        FinalFormFieldProps<any, HTMLElement>,
        'validate' | 'children'
    > {
    source: string;
    name?: string;
    id?: string;
    defaultValue?: any;
    validate?: Validator | Validator[];
    onBlur?: (event: FocusEvent) => void;
    onChange?: (event: ChangeEvent | any) => void;
    onFocus?: (event: FocusEvent) => void;
}

interface ComputedInputProps extends FieldRenderProps<any, HTMLElement> {
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
}: InputProps): ComputedInputProps => {
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
