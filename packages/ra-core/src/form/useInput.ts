import { useCallback, ChangeEvent, FocusEvent, useEffect } from 'react';
import {
    ControllerFieldState,
    ControllerRenderProps,
    useController,
} from 'react-hook-form';
import { useTranslate } from '../i18n';
import {
    Validator,
    composeValidators,
    ValidationErrorMessageWithArgs,
} from './validate';
import { isRequired } from './isRequired';
import { useFormGroupContext } from './useFormGroupContext';
import { useFormContext } from './useFormContext';

export interface InputProps<T = any> {
    defaultValue?: any;
    id?: string;
    input?: Input;
    meta?: InputMeta;
    name?: string;
    onBlur?: (event: FocusEvent<T>) => void;
    onChange?: (event: ChangeEvent | any) => void;
    onFocus?: (event: FocusEvent<T>) => void;
    options?: T;
    parse?: (value: string) => any;
    format?: (value: any) => string;
    resource?: string;
    source: string;
    validate?: Validator | Validator[];
    isRequired?: boolean;
}

export type InputMeta = ControllerFieldState;
export type Input = Omit<ControllerRenderProps, 'onBlur'> & {
    onBlur: (event: FocusEvent) => void;
    onFocus?: (event: FocusEvent) => void;
};

export interface UseInputValue {
    id: string;
    input: Input;
    meta: InputMeta;
    isRequired: boolean;
}

const defaultParseFormat = value => value;

export const useInput = ({
    defaultValue,
    id,
    name,
    source,
    validate,
    onBlur: customOnBlur,
    onChange: customOnChange,
    onFocus,
    isRequired: isRequiredOption,
    format = defaultParseFormat,
    parse = defaultParseFormat,
    ...options
}: InputProps): UseInputValue => {
    const finalName = name || source;
    const formGroupName = useFormGroupContext();
    const formContext = useFormContext();
    const translate = useTranslate();

    const sanitizedValidate = Array.isArray(validate)
        ? composeValidators(validate)
        : validate;
    const {
        field: input,
        fieldState: { invalid, isTouched, isDirty, error },
        formState: { isSubmitted },
    } = useController({
        name: finalName,
        defaultValue,
        rules: {
            validate: async value => {
                if (!sanitizedValidate) return;
                const error = await sanitizedValidate(value);

                if (!error) return;
                if ((error as ValidationErrorMessageWithArgs).message) {
                    const {
                        message,
                        args,
                    } = error as ValidationErrorMessageWithArgs;
                    return translate(message, { _: message, ...args });
                }
                return translate(error as string, { _: error });
            },
        },
    });

    const meta = {
        invalid,
        isTouched: isTouched || isSubmitted,
        isDirty,
        error,
    };

    useEffect(() => {
        if (!formContext || !formGroupName) {
            return;
        }
        formContext.registerField(source, formGroupName);

        return () => {
            formContext.unregisterField(source, formGroupName);
        };
    }, [formContext, formGroupName, source]);

    // Extract the event handlers so that we can provide ours
    // allowing users to provide theirs without breaking the form
    const { onBlur, onChange, ...inputProps } = input;

    const handleBlur = useCallback(
        event => {
            onBlur();
            if (typeof customOnBlur === 'function') {
                customOnBlur(event);
            }
        },
        [onBlur, customOnBlur]
    );

    const handleChange = useCallback(
        event => {
            let finalEvent = event;
            if (parse) {
                finalEvent = {
                    ...event,
                    target: {
                        ...event.target,
                        value: parse(event.target ? event.target.value : event),
                    },
                };
            }
            onChange(finalEvent);
            if (typeof customOnChange === 'function') {
                customOnChange(finalEvent);
            }
        },
        [customOnChange, parse, onChange]
    );

    return {
        id: id || source,
        input: {
            ...inputProps,
            value: format(inputProps.value),
            onBlur: handleBlur,
            onChange: handleChange,
            onFocus,
        },
        meta,
        isRequired: isRequiredOption || isRequired(validate),
    };
};
