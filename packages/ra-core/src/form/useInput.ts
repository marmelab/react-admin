import { ReactElement, useEffect } from 'react';
import {
    ControllerFieldState,
    ControllerRenderProps,
    useController,
    UseControllerProps,
    UseControllerReturn,
    useFormContext,
    UseFormStateReturn,
} from 'react-hook-form';
import get from 'lodash/get';

import { useRecordContext } from '../controller';
import { composeValidators, Validator } from './validate';
import isRequired from './isRequired';
import { useFormGroupContext } from './useFormGroupContext';
import { useGetValidationErrorMessage } from './useGetValidationErrorMessage';
import { useFormGroups } from './useFormGroups';
import { useApplyInputDefaultValues } from './useApplyInputDefaultValues';

export const useInput = (props: InputProps): UseInputValue => {
    const {
        defaultValue,
        format,
        id,
        isRequired: isRequiredOption,
        name,
        onBlur,
        onChange,
        parse,
        source,
        validate,
        ...options
    } = props;
    const finalName = name || source;
    const formGroupName = useFormGroupContext();
    const formGroups = useFormGroups();
    const record = useRecordContext();
    const getValidationErrorMessage = useGetValidationErrorMessage();
    const formContext = useFormContext();

    useEffect(() => {
        if (!formGroups || formGroupName == null) {
            return;
        }

        formGroups.registerField(source, formGroupName);

        return () => {
            formGroups.unregisterField(source, formGroupName);
        };
    }, [formGroups, formGroupName, source]);

    const sanitizedValidate = Array.isArray(validate)
        ? composeValidators(validate)
        : validate;

    // Fetch the defaultValue from the record if available or apply the provided defaultValue.
    // This ensures dynamically added inputs have their value set correctly (ArrayInput for example).
    // We don't do this for the form level defaultValues so that it works as it should in react-hook-form
    // (i.e. field level defaultValue override form level defaultValues for this field).
    const { field: controllerField, fieldState, formState } = useController({
        name: finalName,
        defaultValue: get(record, source, defaultValue),
        rules: {
            validate: async value => {
                if (!sanitizedValidate) return true;
                const error = await sanitizedValidate(
                    value,
                    formContext.getValues(),
                    props
                );

                if (!error) return true;
                return getValidationErrorMessage(error);
            },
        },
        ...options,
    });

    // Because our forms may receive an asynchronously loaded record for instance,
    // they may reset their default values which would override the input default value.
    // This hook ensures that the input default value is applied when a new record is loaded but has
    // no value for the input.
    useApplyInputDefaultValues(props);

    const field = {
        ...controllerField,
        value: format ? format(controllerField.value) : controllerField.value,
        onBlur: (...event: any[]) => {
            if (onBlur) {
                onBlur(...event);
            }
            controllerField.onBlur();
        },
        onChange: (...event: any[]) => {
            if (onChange) {
                onChange(...event);
            }
            const eventOrValue = (typeof event[0]?.target?.checked ===
                'boolean' && event[0]?.target?.value === 'on'
                ? event[0].target.checked
                : event[0]?.target?.value ?? event[0]) as any;
            controllerField.onChange(
                parse ? parse(eventOrValue) : eventOrValue
            );
        },
    };

    return {
        id: id || source,
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
        resource?: string;
        source: string;
        validate?: Validator | Validator[];
    };

export type UseInputValue = {
    id: string;
    isRequired: boolean;
    field: ControllerRenderProps;
    formState: UseFormStateReturn<Record<string, string>>;
    fieldState: ControllerFieldState;
};
