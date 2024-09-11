import { ReactElement, useEffect, useId } from 'react';
import {
    ControllerFieldState,
    ControllerRenderProps,
    useController,
    UseControllerProps,
    UseControllerReturn,
    UseFormStateReturn,
} from 'react-hook-form';
import get from 'lodash/get';

import { useRecordContext } from '../controller';
import { composeValidators, Validator } from './validate';
import isRequired from './isRequired';
import { useFormGroupContext } from './useFormGroupContext';
import { useFormGroups } from './useFormGroups';
import { useApplyInputDefaultValues } from './useApplyInputDefaultValues';
import { useEvent } from '../util';
import { useWrappedSource } from '../core';

// replace null or undefined values by empty string to avoid controlled/uncontrolled input warning
const defaultFormat = (value: any) => (value == null ? '' : value);
// parse empty string into null as it's more suitable for a majority of backends
const defaultParse = (value: string) => (value === '' ? null : value);

export const useInput = <ValueType = any>(
    props: InputProps<ValueType>
): UseInputValue => {
    const {
        defaultValue,
        format = defaultFormat,
        id,
        isRequired: isRequiredOption,
        name,
        onBlur: initialOnBlur,
        onChange: initialOnChange,
        parse: parseProp = defaultParse,
        source,
        validate,
        ...options
    } = props;
    const finalSource = useWrappedSource(source);
    const finalName = name || finalSource;
    const formGroupName = useFormGroupContext();
    const formGroups = useFormGroups();
    const record = useRecordContext();
    // @ts-ignore
    const parse = useEvent(parseProp);
    const defaultId = useId();

    if (!finalName && process.env.NODE_ENV === 'development') {
        console.warn(
            'Input components require either a source or a name prop.'
        );
    }

    useEffect(() => {
        if (!formGroups || formGroupName == null) {
            return;
        }

        formGroups.registerField(finalSource, formGroupName);

        return () => {
            formGroups.unregisterField(finalSource, formGroupName);
        };
    }, [formGroups, formGroupName, finalSource]);

    const sanitizedValidate = Array.isArray(validate)
        ? composeValidators(validate)
        : validate;

    // Fetch the defaultValue from the record if available or apply the provided defaultValue.
    // This ensures dynamically added inputs have their value set correctly (ArrayInput for example).
    // We don't do this for the form level defaultValues so that it works as it should in react-hook-form
    // (i.e. field level defaultValue override form level defaultValues for this field).
    const {
        field: controllerField,
        fieldState,
        formState,
    } = useController({
        name: finalName,
        defaultValue: get(record, finalSource, defaultValue),
        rules: {
            validate: async (value, values) => {
                if (!sanitizedValidate) return true;
                const error = await sanitizedValidate(value, values, {
                    ...props,
                    finalSource,
                });

                if (!error) return true;
                // react-hook-form expects errors to be plain strings but our validators can return objects
                // that have message and args.
                // To avoid double translation for users that validate with a schema instead of our validators
                // we use a special format for our validators errors.
                // The ValidationError component will check for this format and extract the message and args
                // to translate.
                return `@@react-admin@@${JSON.stringify(error)}`;
            },
        },
        ...options,
    });

    // Because our forms may receive an asynchronously loaded record for instance,
    // they may reset their default values which would override the input default value.
    // This hook ensures that the input default value is applied when a new record is loaded but has
    // no value for the input.
    useApplyInputDefaultValues({ inputProps: props });

    const onBlur = useEvent((...event: any[]) => {
        controllerField.onBlur();
        if (initialOnBlur) {
            initialOnBlur(...event);
        }
    });

    const onChange = useEvent((...event: any[]) => {
        const eventOrValue = (
            props.type === 'checkbox' && event[0]?.target?.value === 'on'
                ? event[0].target.checked
                : event[0]?.target?.value ?? event[0]
        ) as any;
        controllerField.onChange(parse ? parse(eventOrValue) : eventOrValue);
        if (initialOnChange) {
            initialOnChange(...event);
        }
    });

    const field = {
        ...controllerField,
        value: format ? format(controllerField.value) : controllerField.value,
        onBlur,
        onChange,
    };

    return {
        id: id || defaultId,
        field,
        fieldState,
        formState,
        isRequired: isRequiredOption || isRequired(validate),
    };
};

export type InputProps<ValueType = any> = Omit<
    UseControllerProps,
    'name' | 'defaultValue' | 'rules'
> &
    Partial<UseControllerReturn> & {
        alwaysOn?: any;
        defaultValue?: any;
        format?: (value: ValueType) => any;
        id?: string;
        isRequired?: boolean;
        label?: string | ReactElement | false;
        helperText?: string | ReactElement | false;
        name?: string;
        onBlur?: (...event: any[]) => void;
        onChange?: (...event: any[]) => void;
        parse?: (value: any) => ValueType;
        type?: string;
        resource?: string;
        source: string;
        validate?: Validator | Validator[];
        readOnly?: boolean;
        disabled?: boolean;
    };

export type UseInputValue = {
    id: string;
    isRequired: boolean;
    field: ControllerRenderProps;
    formState: UseFormStateReturn<Record<string, string>>;
    fieldState: ControllerFieldState;
};
