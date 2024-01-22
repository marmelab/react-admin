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
import {
    useRecordContext,
    OptionalRecordContextProvider,
    SaveHandler,
} from '../controller';
import { SourceContextProvider, SourceContextValue, useResourceContext } from '../core';
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
// TODO: remove after upgrading prettier
// eslint-disable-next-line prettier/prettier
export const Form = <RecordType = any>(props: FormProps<RecordType>) => {
    const { children, id, className, noValidate = false } = props;
    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    const { form, formHandleSubmit } = useAugmentedForm(props);
    const sourceContext = React.useMemo<SourceContextValue>(() => ({
        getSource: (source: string) => source,
        getLabel: (source: string) => `resources.${resource}.fields.${source}`,
    }), [resource]);

    return (
        <OptionalRecordContextProvider value={record}>
            <SourceContextProvider value={sourceContext}>
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
            </SourceContextProvider>
        </OptionalRecordContextProvider>
    );
};

export type FormProps<RecordType = any> = FormOwnProps<RecordType> &
    Omit<UseFormProps, 'onSubmit'> & {
        validate?: ValidateForm;
        noValidate?: boolean;
    };

export interface FormOwnProps<RecordType = any> {
    children: ReactNode;
    className?: string;
    defaultValues?: any;
    formRootPathname?: string;
    id?: string;
    record?: Partial<RaRecord>;
    resource?: string;
    onSubmit?: SubmitHandler<FieldValues> | SaveHandler<RecordType>;
    warnWhenUnsavedChanges?: boolean;
    sanitizeEmptyValues?: boolean;
    disableInvalidFormNotification?: boolean;
}
