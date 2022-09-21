import {
    BaseSyntheticEvent,
    useCallback,
    useMemo,
    useEffect,
    useRef,
} from 'react';
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
        context,
        criteriaMode = 'firstError',
        defaultValues,
        delayError,
        formRootPathname,
        mode,
        resolver,
        reValidateMode = 'onChange',
        onSubmit,
        sanitizeEmptyValues,
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

    const formRef = useRef(form);

    // According to react-hook-form docs: https://react-hook-form.com/api/useform/formstate
    // `formState` must be read before a render in order to enable the state update.
    const {
        formState: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isSubmitting,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isDirty,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isValid,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isValidating,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            dirtyFields,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            errors,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            submitCount,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            touchedFields,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isSubmitted,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isSubmitSuccessful,
        },
    } = form;

    // initialize form with record
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (!record) {
            return;
        }
        const initialValues = getFormInitialValues(defaultValues, record);
        form.reset(initialValues);
    }, [
        JSON.stringify({
            defaultValues:
                typeof defaultValues === 'function'
                    ? 'function'
                    : defaultValues,
            record,
        }),
    ]);
    /* eslint-enable react-hooks/exhaustive-deps */

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
        async values => {
            let errors;
            const finalValues = sanitizeEmptyValues
                ? sanitizeValues(values, record)
                : values;
            if (onSubmit) {
                errors = await onSubmit(finalValues);
            }
            if (onSubmit == null && saveContext?.save) {
                errors = await saveContext.save(finalValues);
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
    onSubmit?: (data: FieldValues) => any | Promise<any>;
    warnWhenUnsavedChanges?: boolean;
    sanitizeEmptyValues?: boolean;
}
