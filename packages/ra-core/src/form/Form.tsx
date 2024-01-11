import * as React from 'react';
import { ReactNode } from 'react';
import {
    FormProvider,
    FieldValues,
    UseFormProps,
    SubmitHandler,
} from 'react-hook-form';

import { FormGroupsProvider } from './FormGroupsProvider';
import { RaRecord } from '../types';
import { useRecordContext, OptionalRecordContextProvider } from '../controller';
import { useResourceContext } from '../core';
import { LabelPrefixContextProvider } from '../util';
import { ValidateForm } from './getSimpleValidationResolver';
import { useAugmentedForm } from './useAugmentedForm';

/**
 * Creates a form element, initialized with the current record, calling the saveContext on submit
 *
 * Wrapper around react-hook-form's useForm, FormContextProvider, and <form>.
 * Also sets up a FormGroupContext, and handles submission validation.
 *
 * @example
 *
 * const MyForm = ({ record, defaultValues, validate }) => (
 *    <Form record={record} defaultValues={defaultValues} validate={validate}>
 *        <Stack>
 *            <TextInput source="title" />
 *            <SaveButton />
 *        </Stack>
 *    </Form>
 * );
 *
 * @typedef {Object} Props the props you can use
 * @prop {Object} defaultValues
 * @prop {Function} validate
 * @prop {Function} save
 *
 * @see useForm
 * @see FormGroupContext
 *
 * @link https://react-hook-form.com/docs/useformcontext
 */
export const Form = (props: FormProps) => {
    const { children, id, className, noValidate = false } = props;
    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    const { form, formHandleSubmit } = useAugmentedForm(props);

    return (
        <OptionalRecordContextProvider value={record}>
            <LabelPrefixContextProvider prefix={`resources.${resource}.fields`}>
                <FormProvider {...form}>
                    <FormGroupsProvider>
                        <form
                            onSubmit={formHandleSubmit}
                            noValidate={noValidate}
                            id={id}
                            className={className}
                        >
                            {children}
                        </form>
                    </FormGroupsProvider>
                </FormProvider>
            </LabelPrefixContextProvider>
        </OptionalRecordContextProvider>
    );
};

export type FormProps = FormOwnProps &
    Omit<UseFormProps, 'onSubmit'> & {
        validate?: ValidateForm;
        noValidate?: boolean;
    };

export interface FormOwnProps {
    children: ReactNode;
    className?: string;
    defaultValues?: any;
    formRootPathname?: string;
    id?: string;
    record?: Partial<RaRecord>;
    resource?: string;
    onSubmit?: SubmitHandler<FieldValues>;
    warnWhenUnsavedChanges?: boolean;
    sanitizeEmptyValues?: boolean;
    disableInvalidFormNotification?: boolean;
}
