import * as React from 'react';
import { BaseSyntheticEvent, useCallback, useMemo } from 'react';
import {
    FormProvider,
    FieldValues,
    useForm,
    UseFormProps,
} from 'react-hook-form';

import { RaRecord } from '../types';
import { useSaveContext } from '../controller';
import { useRecordContext, OptionalRecordContextProvider } from '../controller';
import getFormInitialValues from './getFormInitialValues';
import {
    getSimpleValidationResolver,
    ValidateForm,
} from './getSimpleValidationResolver';
import { setSubmissionErrors } from './setSubmissionErrors';
import { FormContent } from './FormContent';

/**
 * Wrapper around react-hook-form's useForm. It sets up a [FormContext]{@link https://react-hook-form.com/api/useformcontext} and a FormGroupContext. It also handle submission validation.
 *
 * Requires a render function.
 *
 * @example
 *
 * const SimpleForm = props => (
 *    <Form
 *        {...props}
 *        render={formProps => <SimpleFormView {...formProps} />}
 *    />
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by Create or Edit)
 * @prop {Object} initialValues
 * @prop {Function} validate
 * @prop {Function} save
 * @prop {boolean} submitOnEnter
 * @prop {string} redirect
 * @prop {boolean} sanitizeEmptyValues
 *
 * @see FormGroupContext
 */
export const Form = (props: FormProps) => {
    const {
        context,
        criteriaMode = 'firstError',
        defaultValues,
        delayError,
        formRootPathname,
        mode,
        render,
        resolver,
        reValidateMode = 'onChange',
        onSubmit,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
        warnWhenUnsavedChanges,
        validate,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const saveContext = useSaveContext();

    const defaultValuesIncludingRecord = useMemo(
        () => getFormInitialValues(defaultValues, record),
        [JSON.stringify({ defaultValues, record })] // eslint-disable-line
    );

    const form = useForm({
        context,
        criteriaMode,
        defaultValues: defaultValuesIncludingRecord,
        delayError,
        mode,
        reValidateMode,
        resolver:
            resolver ?? validate
                ? getSimpleValidationResolver(validate)
                : undefined,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
    });

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

    return (
        <OptionalRecordContextProvider value={record}>
            <FormProvider {...form}>
                <FormContent
                    {...rest}
                    defaultValues={defaultValues}
                    handleSubmit={form.handleSubmit(handleSubmit)}
                    record={record}
                    render={render}
                    warnWhenUnsavedChanges={warnWhenUnsavedChanges}
                    formRootPathname={formRootPathname}
                />
            </FormProvider>
        </OptionalRecordContextProvider>
    );
};

export type FormProps = FormOwnProps &
    Omit<UseFormProps, 'onSubmit'> & {
        validate?: ValidateForm;
    };

export type FormRenderProps = {
    handleSubmit: (e?: BaseSyntheticEvent) => void;
};

export type FormRender = (
    props: FormRenderProps
) => React.ReactElement<any, any>;

export interface FormOwnProps {
    defaultValues?: any;
    formRootPathname?: string;
    record?: Partial<RaRecord>;
    render: FormRender;
    onSubmit?: (data: FieldValues) => any | Promise<any>;
    sanitizeEmptyValues?: boolean;
    saving?: boolean;
    warnWhenUnsavedChanges?: boolean;
}
