import { BaseSyntheticEvent, useCallback, useMemo, useRef } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm,
    UseFormProps,
} from 'react-hook-form';

import { RaRecord } from '../types';
import { useSaveContext } from '../controller';
import { useRecordContext } from '../controller';
import getFormInitialValues from './getFormInitialValues';
import {
    getSimpleValidationResolver,
    ValidateForm,
} from './getSimpleValidationResolver';
import { setSubmissionErrors } from './setSubmissionErrors';
import { useNotifyIsFormInvalid } from './useNotifyIsFormInvalid';
import { useWarnWhenUnsavedChanges } from './useWarnWhenUnsavedChanges';
import { sanitizeEmptyValues as sanitizeValues } from './sanitizeEmptyValues';

/**
 * Wrapper around react-hook-form's useForm
 *
 * This hook adds the following features to react-hook-form's useForm:
 *
 * - form initialization based on RecordContext
 * - validation based on a validate function
 * - sanitization of empty values
 * - notification on invalid form
 * - stop form submission event propagation
 */
export const useAugmentedForm = (props: UseAugmentedFormProps) => {
    const {
        criteriaMode = 'firstError',
        defaultValues,
        formRootPathname,
        resolver,
        reValidateMode = 'onChange',
        onSubmit,
        sanitizeEmptyValues,
        warnWhenUnsavedChanges,
        validate,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const saveContext = useSaveContext();

    const defaultValuesIncludingRecord = useMemo(
        () => getFormInitialValues(defaultValues, record),
        // eslint-disable-next-line
        [
            // eslint-disable-next-line
            JSON.stringify({
                defaultValues:
                    typeof defaultValues === 'function'
                        ? 'function'
                        : defaultValues,
                record,
            }),
        ]
    );

    const finalResolver = resolver
        ? resolver
        : validate
        ? getSimpleValidationResolver(validate)
        : undefined;

    const form = useForm({
        criteriaMode,
        values: defaultValuesIncludingRecord,
        reValidateMode,
        resolver: finalResolver,
        ...rest,
    });

    const formRef = useRef(form);

    // notify on invalid form
    useNotifyIsFormInvalid(form.control);

    // warn when unsaved change
    useWarnWhenUnsavedChanges(
        Boolean(warnWhenUnsavedChanges),
        formRootPathname,
        form.control
    );

    // submit callbacks
    const handleSubmit = useCallback(
        async (values, event) => {
            let errors;
            const finalValues = sanitizeEmptyValues
                ? sanitizeValues(values, record)
                : values;
            if (onSubmit) {
                errors = await onSubmit(finalValues, event);
            }
            if (onSubmit == null && saveContext?.save) {
                errors = await saveContext.save(finalValues, event);
            }
            if (errors != null) {
                setSubmissionErrors(errors, formRef.current.setError);
            }
        },
        [onSubmit, saveContext, sanitizeEmptyValues, record]
    );

    const formHandleSubmit = useCallback(
        (event: BaseSyntheticEvent) => {
            if (!event.defaultPrevented) {
                // Prevent outer forms to receive the event
                event.stopPropagation();
                form.handleSubmit(handleSubmit)(event);
            }
            return;
        },
        [form, handleSubmit]
    );

    return {
        form,
        handleSubmit,
        formHandleSubmit,
    };
};

export type UseAugmentedFormProps = UseFormOwnProps &
    Omit<UseFormProps, 'onSubmit'> & {
        validate?: ValidateForm;
    };

export interface UseFormOwnProps {
    defaultValues?: any;
    formRootPathname?: string;
    record?: Partial<RaRecord>;
    onSubmit?: SubmitHandler<FieldValues>;
    warnWhenUnsavedChanges?: boolean;
    sanitizeEmptyValues?: boolean;
}
