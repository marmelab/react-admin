import * as React from 'react';
import { SyntheticEvent, useRef, useMemo } from 'react';
import { Form, FormProps, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import useResetSubmitErrors from './useResetSubmitErrors';
import sanitizeEmptyValues from './sanitizeEmptyValues';
import getFormInitialValues from './getFormInitialValues';
import { Record as RaRecord } from '../types';
import { useNotify } from '../sideEffect';
import { useSaveContext, SaveHandler } from '../controller';
import { useRecordContext, OptionalRecordContextProvider } from '../controller';
import submitErrorsMutators from './submitErrorsMutators';
import useWarnWhenUnsavedChanges from './useWarnWhenUnsavedChanges';
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
export const FormWithRedirect = ({
    debug,
    decorators,
    defaultValue,
    destroyOnUnregister,
    form,
    formRootPathname,
    initialValues,
    initialValuesEqual,
    keepDirtyOnReinitialize = true,
    mutators = defaultMutators,
    onSubmit,
    render,
    saving,
    subscription = defaultSubscription,
    validate,
    validateOnBlur,
    warnWhenUnsavedChanges,
    sanitizeEmptyValues: shouldSanitizeEmptyValues = true,
    ...props
}: FormWithRedirectProps) => {
    const record = useRecordContext(props);
    const saveContext = useSaveContext();

    const onSave = useRef(onSubmit ?? saveContext?.save);
    const finalMutators = useMemo(
        () =>
            mutators === defaultMutators
                ? mutators
                : { ...defaultMutators, ...mutators },
        [mutators]
    );

    const finalInitialValues = useMemo(
        () => getFormInitialValues(initialValues, defaultValue, record),
        [JSON.stringify({ initialValues, defaultValue, record })] // eslint-disable-line
    );

    const handleSubmit = values => {
        if (shouldSanitizeEmptyValues) {
            const sanitizedValues = sanitizeEmptyValues(
                finalInitialValues,
                values
            );
            return onSave.current(sanitizedValues);
        } else {
            return onSave.current(values);
        }
    };

    return (
        <OptionalRecordContextProvider value={record}>
            <Form
                key={record?.id || ''}
                debug={debug}
                decorators={decorators}
                destroyOnUnregister={destroyOnUnregister}
                form={form}
                initialValues={finalInitialValues}
                initialValuesEqual={initialValuesEqual}
                keepDirtyOnReinitialize={keepDirtyOnReinitialize}
                mutators={finalMutators} // necessary for ArrayInput
                onSubmit={handleSubmit}
                subscription={subscription} // don't redraw entire form each time one field changes
                validate={validate}
                validateOnBlur={validateOnBlur}
                render={formProps => (
                    // @ts-ignore Ignored because of a weird error about the active prop
                    <FormView
                        {...props}
                        {...formProps}
                        record={record}
                        saving={formProps.submitting || saving}
                        render={render}
                        warnWhenUnsavedChanges={warnWhenUnsavedChanges}
                        formRootPathname={formRootPathname}
                    />
                )}
            />
        </OptionalRecordContextProvider>
    );
};

export type FormWithRedirectProps = FormWithRedirectOwnProps &
    Omit<FormProps, 'onSubmit'>;

export type FormWithRedirectRenderProps = Omit<
    FormViewProps,
    'children' | 'render' | 'setRedirect'
>;

export type FormWithRedirectRender = (
    props: FormWithRedirectRenderProps
) => React.ReactElement<any, any>;

export interface FormWithRedirectOwnProps {
    defaultValue?: any;
    formRootPathname?: string;
    record?: Partial<RaRecord>;
    render: FormWithRedirectRender;
    onSubmit?: SaveHandler;
    sanitizeEmptyValues?: boolean;
    saving?: boolean;
    warnWhenUnsavedChanges?: boolean;
}

const defaultMutators = {
    ...arrayMutators,
    ...submitErrorsMutators,
};

const defaultSubscription = {
    submitting: true,
    pristine: true,
    valid: true,
    invalid: true,
    validating: true,
};

interface FormViewProps
    extends FormWithRedirectOwnProps,
        Omit<FormRenderProps, 'render' | 'component'> {
    warnWhenUnsavedChanges?: boolean;
}

const FormView = ({
    formRootPathname,
    handleSubmit: formHandleSubmit,
    render,
    warnWhenUnsavedChanges,
    ...props
}: FormViewProps) => {
    useResetSubmitErrors();
    useWarnWhenUnsavedChanges(warnWhenUnsavedChanges, formRootPathname);
    const notify = useNotify();

    const handleSubmit = (
        event?: Partial<
            Pick<
                SyntheticEvent<Element, Event>,
                'preventDefault' | 'stopPropagation'
            >
        >
    ) => {
        if (props.invalid) {
            notify('ra.message.invalid_form', { type: 'warning' });
        }

        return formHandleSubmit(event);
    };

    return (
        <FormGroupsProvider>
            {render({ ...props, handleSubmit })}
        </FormGroupsProvider>
    );
};
