import * as React from 'react';
import { BaseSyntheticEvent, useCallback, useMemo } from 'react';
import {
    FormProvider,
    SubmitHandler,
    useForm,
    UseFormProps,
} from 'react-hook-form';

import getFormInitialValues from './getFormInitialValues';
import { RaRecord } from '../types';
import { useNotify } from '../notification';
import { useSaveContext } from '../controller';
import { useRecordContext, OptionalRecordContextProvider } from '../controller';
import { useWarnWhenUnsavedChanges } from './useWarnWhenUnsavedChanges';
import { useInitializeFormWithRecord } from './useInitializeFormWithRecord';
import { FormGroupsProvider } from './FormGroupsProvider';

/**
 * Wrapper around react-final-form's Form to handle redirection on submit,
 * legacy defaultValue prop, and array inputs.
 *
 * Requires a render function, just like react-final-form
 *
 * @example
 *
 * const SimpleForm = props => (
 *    <FormWithRedirect
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
 * @param {Props} props
 */
export const FormWithRedirect = (props: FormWithRedirectProps) => {
    const {
        context,
        criteriaMode = 'firstError',
        defaultValues,
        delayError,
        formRootPathname,
        mode = 'onSubmit',
        render,
        resolver,
        reValidateMode = 'onChange',
        onSubmit,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
        warnWhenUnsavedChanges,
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
        resolver,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
    });

    const { isValid } = form.formState;

    const handleSubmit = useCallback(
        values => {
            if (onSubmit) {
                return onSubmit(values);
            }
            if (saveContext?.save) {
                saveContext.save(values);
            }
        },
        [onSubmit, saveContext]
    );

    return (
        <OptionalRecordContextProvider value={record}>
            <FormProvider {...form}>
                <FormView
                    {...props}
                    defaultValues={defaultValues}
                    handleSubmit={form.handleSubmit(handleSubmit)}
                    record={record}
                    render={render}
                    isValid={isValid}
                    warnWhenUnsavedChanges={warnWhenUnsavedChanges}
                    formRootPathname={formRootPathname}
                />
            </FormProvider>
        </OptionalRecordContextProvider>
    );
};

export type FormWithRedirectProps = FormWithRedirectOwnProps &
    Omit<UseFormProps, 'onSubmit'>;

export type FormWithRedirectRenderProps = Omit<
    FormViewProps,
    'children' | 'isValid' | 'render' | 'setRedirect'
>;

export type FormWithRedirectRender = (
    props: FormWithRedirectRenderProps
) => React.ReactElement<any, any>;

export interface FormWithRedirectOwnProps {
    defaultValues?: any;
    formRootPathname?: string;
    record?: Partial<RaRecord>;
    render: FormWithRedirectRender;
    onSubmit?: SubmitHandler<Record<string, any>>;
    sanitizeEmptyValues?: boolean;
    saving?: boolean;
    warnWhenUnsavedChanges?: boolean;
}

interface FormViewProps extends FormWithRedirectOwnProps {
    handleSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
    isValid: boolean;
    warnWhenUnsavedChanges?: boolean;
}

const FormView = (props: FormViewProps) => {
    const {
        defaultValues,
        formRootPathname,
        handleSubmit: formHandleSubmit,
        isValid,
        record,
        render,
        warnWhenUnsavedChanges,
        ...rest
    } = props;
    useInitializeFormWithRecord(defaultValues, record);
    useWarnWhenUnsavedChanges(warnWhenUnsavedChanges, formRootPathname);
    const notify = useNotify();

    const handleSubmit = (event?: BaseSyntheticEvent) => {
        if (!isValid) {
            notify('ra.message.invalid_form', { type: 'warning' });
        }

        return formHandleSubmit(event);
    };

    return (
        <FormGroupsProvider>
            {render({ ...rest, handleSubmit })}
        </FormGroupsProvider>
    );
};
