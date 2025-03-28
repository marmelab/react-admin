import {
    BaseSyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm,
    UseFormProps,
} from 'react-hook-form';
import merge from 'lodash/merge';
import { RaRecord } from '../types';
import { SaveHandler, useRecordContext, useSaveContext } from '../controller';
import getFormInitialValues from './getFormInitialValues';
import {
    getSimpleValidationResolver,
    ValidateForm,
} from './validation/getSimpleValidationResolver';
import { setSubmissionErrors } from './validation/setSubmissionErrors';
import { useNotifyIsFormInvalid } from './validation/useNotifyIsFormInvalid';
import { sanitizeEmptyValues as sanitizeValues } from './sanitizeEmptyValues';
import { useRecordFromLocation } from './useRecordFromLocation';

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
export const useAugmentedForm = <RecordType = any>(
    props: UseAugmentedFormProps<RecordType>
) => {
    const {
        criteriaMode = 'firstError',
        defaultValues,
        formRootPathname,
        resolver,
        reValidateMode = 'onChange',
        onSubmit,
        sanitizeEmptyValues,
        validate,
        disableInvalidFormNotification,
        ...rest
    } = props;
    const saveContext = useSaveContext();
    const record = useRecordContext(props);

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
    useNotifyIsFormInvalid(form.control, !disableInvalidFormNotification);

    const recordFromLocation = useRecordFromLocation();
    const recordFromLocationApplied = useRef(false);
    const { reset } = form;
    useEffect(() => {
        if (recordFromLocation && !recordFromLocationApplied.current) {
            reset(merge({}, defaultValuesIncludingRecord, recordFromLocation), {
                keepDefaultValues: true,
            });
            recordFromLocationApplied.current = true;
        }
    }, [defaultValuesIncludingRecord, recordFromLocation, reset]);

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

export type UseAugmentedFormProps<RecordType = any> =
    UseFormOwnProps<RecordType> &
        Omit<UseFormProps, 'onSubmit'> & {
            validate?: ValidateForm;
        };

export interface UseFormOwnProps<RecordType = any> {
    defaultValues?: any;
    formRootPathname?: string;
    record?: Partial<RaRecord>;
    onSubmit?: SubmitHandler<FieldValues> | SaveHandler<RecordType>;
    sanitizeEmptyValues?: boolean;
    disableInvalidFormNotification?: boolean;
}
