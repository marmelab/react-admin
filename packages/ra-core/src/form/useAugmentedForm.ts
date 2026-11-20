import {
    BaseSyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import {
    Control,
    FieldValues,
    SubmitHandler,
    useForm,
    UseFormProps,
} from 'react-hook-form';
import merge from 'lodash/merge.js';
import { RaRecord } from '../types';
import { useLocation } from '../routing';
import { useEvent } from '../util';
import { SaveHandler, useRecordContext, useSaveContext } from '../controller';
import getFormInitialValues from './getFormInitialValues';
import {
    getSimpleValidationResolver,
    ValidateForm,
} from './validation/getSimpleValidationResolver';
import { setSubmissionErrors } from './validation/setSubmissionErrors';
import { useNotifyIsFormInvalid } from './validation/useNotifyIsFormInvalid';
import { sanitizeEmptyValues as sanitizeValues } from './sanitizeEmptyValues';
import {
    getRecordFromLocation,
    useRecordFromLocation,
} from './useRecordFromLocation';
import { ignoreValuesWithoutInput } from './ignoreValuesWithoutInput';

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
        resetOptions,
        reValidateMode = 'onChange',
        onSubmit,
        sanitizeEmptyValues,
        validate,
        disableInvalidFormNotification,
        allowedLocationFields,
        disablePrefillFromLocation,
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

    const baseForm = useForm({
        criteriaMode,
        defaultValues: defaultValuesIncludingRecord,
        reValidateMode,
        resolver: finalResolver,
        ...rest,
    });

    // The values from the location search are only submitted for the fields that have an input,
    // or that are listed in allowedLocationFields
    const recordFromLocationSearch = useRef<Partial<RaRecord> | null>(null);
    const { handleSubmit: baseHandleSubmit, control } = baseForm;
    const ignoreLocationValuesWithoutInput = useEvent((values: FieldValues) =>
        ignoreValuesWithoutInput(
            values,
            recordFromLocationSearch.current,
            defaultValuesIncludingRecord,
            [...getInputNames(control), ...(allowedLocationFields ?? [])]
        )
    );
    const handleSubmitWithoutIgnoredValues = useCallback<
        typeof baseHandleSubmit
    >(
        (onValid, onInvalid) =>
            baseHandleSubmit(
                (values, event) =>
                    onValid(ignoreLocationValuesWithoutInput(values), event),
                onInvalid
            ),
        [baseHandleSubmit, ignoreLocationValuesWithoutInput]
    );
    const form = {
        ...baseForm,
        handleSubmit: handleSubmitWithoutIgnoredValues,
    };

    const formRef = useRef(form);
    const { reset, formState } = form;
    const { isReady } = formState;

    const previousRecordId = useRef(record?.id);

    useEffect(() => {
        const recordIdChanged = record?.id !== previousRecordId.current;
        previousRecordId.current = record?.id;

        reset(
            defaultValuesIncludingRecord,
            recordIdChanged ? undefined : resetOptions
        );
    }, [defaultValuesIncludingRecord, reset, resetOptions, record?.id]);

    // notify on invalid form
    useNotifyIsFormInvalid(form.control, !disableInvalidFormNotification);

    const recordFromLocation = useRecordFromLocation();
    const location = useLocation();
    const isRecordFromLocationState =
        getRecordFromLocation({ ...location, search: '' }) != null;
    const isIdAllowedFromLocation = !!allowedLocationFields?.includes('id');
    const recordFromLocationApplied = useRef(false);
    useEffect(() => {
        if (!isReady || disablePrefillFromLocation) return;
        if (recordFromLocation && !recordFromLocationApplied.current) {
            // the record identifier is only taken from the location search when it is allowed explicitly
            const { id, ...recordFromLocationWithoutId } = recordFromLocation;
            const valuesFromLocation =
                isRecordFromLocationState || isIdAllowedFromLocation
                    ? recordFromLocation
                    : recordFromLocationWithoutId;
            reset(merge({}, defaultValuesIncludingRecord, valuesFromLocation), {
                keepDefaultValues: true,
            });
            recordFromLocationApplied.current = true;
            recordFromLocationSearch.current = isRecordFromLocationState
                ? null
                : valuesFromLocation;
        }
    }, [
        defaultValuesIncludingRecord,
        disablePrefillFromLocation,
        isIdAllowedFromLocation,
        isRecordFromLocationState,
        recordFromLocation,
        reset,
        isReady,
    ]);

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
                handleSubmitWithoutIgnoredValues(handleSubmit)(event);
            }
            return;
        },
        [handleSubmitWithoutIgnoredValues, handleSubmit]
    );

    return {
        form,
        handleSubmit,
        formHandleSubmit,
    };
};

// react-hook-form has no public API listing the registered inputs.
// An array input only covers the values that the inputs of its items cover.
const getInputNames = (control: Control<any>) =>
    Array.from(control._names.mount).filter(
        name => !control._names.array.has(name)
    );

export type UseAugmentedFormProps<RecordType = any> =
    UseFormOwnProps<RecordType> &
        Omit<
            UseFormProps<
                RecordType extends FieldValues ? RecordType : FieldValues
            >,
            'onSubmit' | 'validate'
        > & {
            validate?: ValidateForm;
        };

export interface UseFormOwnProps<RecordType = any> {
    defaultValues?: any;
    formRootPathname?: string;
    record?: Partial<RaRecord>;
    onSubmit?: SubmitHandler<FieldValues> | SaveHandler<RecordType>;
    sanitizeEmptyValues?: boolean;
    disableInvalidFormNotification?: boolean;
    allowedLocationFields?: string[];
    disablePrefillFromLocation?: boolean;
}
