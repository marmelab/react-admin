import { BaseSyntheticEvent, useCallback, useMemo, useEffect } from 'react';
import { FieldValues, useForm, UseFormProps } from 'react-hook-form';

import { RaRecord } from '../types';
import { useSaveContext } from '../controller';
import { useRecordContext } from '../controller';
import getFormInitialValues from './getFormInitialValues';
import {
    getSimpleValidationResolver,
    ValidateForm,
} from './getSimpleValidationResolver';
import { setSubmissionErrors } from './setSubmissionErrors';
import { useNotify } from '../notification';
import { useIsFormInvalid } from './useIsFormInvalid';
import { useWarnWhenUnsavedChanges } from './useWarnWhenUnsavedChanges';

/**
 * Wrapper around react-hook-form's useForm
 *
 * This hook adds the following features to react-hook-form's useForm:
 *
 * - form initialization based on Recordcontext
 * - validation based on a validate function
 * - notification on invalid form
 * - stop form submission event propagation
 */
export const useAugmentedForm = (props: UseAugmentedFormProps) => {
    const {
        context,
        criteriaMode = 'firstError',
        defaultValues,
        delayError,
        formRootPathname,
        mode,
        resolver,
        reValidateMode = 'onChange',
        onSubmit,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
        warnWhenUnsavedChanges,
        validate,
    } = props;
    const record = useRecordContext(props);
    const saveContext = useSaveContext();

    const defaultValuesIncludingRecord = useMemo(
        () => getFormInitialValues(defaultValues, record),
        [JSON.stringify({ defaultValues, record })] // eslint-disable-line
    );

    const finalResolver = resolver
        ? resolver
        : validate
        ? getSimpleValidationResolver(validate)
        : undefined;

    const form = useForm({
        context,
        criteriaMode,
        defaultValues: defaultValuesIncludingRecord,
        delayError,
        mode,
        reValidateMode,
        resolver: finalResolver,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
    });

    // initialize form with record
    useEffect(() => {
        if (!record) {
            return;
        }
        const initialValues = getFormInitialValues(defaultValues, record);
        form.reset(initialValues);
    }, [form.reset, JSON.stringify(record, defaultValues)]); // eslint-disable-line react-hooks/exhaustive-deps

    // notify on invalid form
    const isInvalid = useIsFormInvalid(form.control);
    const notify = useNotify();
    useEffect(() => {
        if (isInvalid) {
            notify('ra.message.invalid_form', { type: 'warning' });
        }
    }, [isInvalid, notify]);

    // warn when unsaved change
    useWarnWhenUnsavedChanges(
        warnWhenUnsavedChanges,
        formRootPathname,
        form.control
    );

    // submit callbacks
    const handleSubmit = useCallback(
        async values => {
            let errors;

            if (onSubmit) {
                errors = await onSubmit(values);
            }
            if (onSubmit == null && saveContext?.save) {
                errors = await saveContext.save(values);
            }
            if (errors != null) {
                setSubmissionErrors(errors, form.setError);
            }
        },
        [form, onSubmit, saveContext]
    );

    const formHandleSubmit = useCallback(
        (event: BaseSyntheticEvent) => {
            // Prevent outer forms to receive the event
            event.stopPropagation();
            form.handleSubmit(handleSubmit)(event);
            return;
        },
        [form, handleSubmit]
    );

    return {
        form,
        handleSubmit,
        formHandleSubmit,
        isInvalid,
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
    onSubmit?: (data: FieldValues) => any | Promise<any>;
    warnWhenUnsavedChanges?: boolean;
}
