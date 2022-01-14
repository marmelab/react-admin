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
import {
    composeValidators,
    ValidationErrorMessageWithArgs,
    Validator,
} from './validate';
import isRequired from './isRequired';
import { useFormGroupContext } from './useFormGroupContext';
import { useFormGroups } from './useFormGroups';
import { useRecordContext } from '../controller';
import { useTranslate } from '../i18n';
import { useDeepCompareEffect } from '../util/hooks';

export type InputProps<ValueType = any> = Omit<
    UseControllerProps,
    'name' | 'defaultValue' | 'rules'
> &
    Partial<UseControllerReturn> & {
        defaultValue?: any;
        format?: (value: ValueType) => string;
        id?: string;
        isRequired?: boolean;
        label?: string | ReactElement | false;
        helperText?: string | ReactElement | false;
        name?: string;
        onBlur?: (...event: any[]) => void;
        onChange?: (...event: any[]) => void;
        parse?: (value: string) => ValueType;
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

export const useInput = (props: InputProps): UseInputValue => {
    const {
        defaultValue,
        id,
        isRequired: isRequiredOption,
        name,
        onBlur,
        onChange,
        source,
        validate,
        ...options
    } = props;
    const finalName = name || source;
    const formGroupName = useFormGroupContext();
    const formGroups = useFormGroups();
    const record = useRecordContext();
    const translate = useTranslate();
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
    // This ensure dynamically added inputs have their value set correctly (ArrayInput for example).
    // We don't do this for the form level defaultValues so that it works as it should in final-form
    // (ie. field level defaultValue override form level defaultValues for this field).
    const { field: controllerField, fieldState, formState } = useController({
        name: finalName,
        defaultValue: get(record, source, defaultValue),
        rules: {
            validate: async value => {
                if (!sanitizedValidate) return;
                const error = await sanitizedValidate(
                    value,
                    formContext.getValues(),
                    props
                );

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
        ...options,
    });

    // Update the input value whenever the record changes
    useDeepCompareEffect(() => {
        if (
            (!record || get(record, source) == undefined) && // eslint-disable-line eqeqeq
            get(formContext.getValues(), source) == undefined && // eslint-disable-line eqeqeq
            defaultValue != undefined // eslint-disable-line eqeqeq
        ) {
            formContext.resetField(source, {
                defaultValue: get(record, source, defaultValue),
            });
        }
    }, [record]);

    // If there is an input prop, this input has already been enhanced by final-form
    // This is required in for inputs used inside other inputs (such as the SelectInput inside a ReferenceInput)
    if (options.field) {
        return {
            id: id || source,
            field: options.field,
            fieldState: options.fieldState,
            formState: options.formState,
            isRequired: isRequiredOption || isRequired(validate),
        };
    }

    const field = {
        ...controllerField,
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
            controllerField.onChange(...event);
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
