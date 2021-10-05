import * as React from 'react';
import { useRef, useCallback, useEffect, useMemo } from 'react';
import { Form, FormProps, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import useInitializeFormWithRecord from './useInitializeFormWithRecord';
import useWarnWhenUnsavedChanges from './useWarnWhenUnsavedChanges';
import useResetSubmitErrors from './useResetSubmitErrors';
import sanitizeEmptyValues from './sanitizeEmptyValues';
import getFormInitialValues from './getFormInitialValues';
import {
    FormContextValue,
    Record as RaRecord,
    OnSuccess,
    OnFailure,
} from '../types';
import { RedirectionSideEffect } from '../sideEffect';
import { useDispatch } from 'react-redux';
import { setAutomaticRefresh } from '../actions/uiActions';
import { FormContextProvider } from './FormContextProvider';
import submitErrorsMutators from './submitErrorsMutators';

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
const FormWithRedirect = ({
    debug,
    decorators,
    defaultValue,
    destroyOnUnregister,
    form,
    initialValues,
    initialValuesEqual,
    keepDirtyOnReinitialize = true,
    mutators = defaultMutators,
    record,
    render,
    save,
    saving,
    subscription = defaultSubscription,
    validate,
    validateOnBlur,
    version,
    warnWhenUnsavedChanges,
    sanitizeEmptyValues: shouldSanitizeEmptyValues = true,
    ...props
}: FormWithRedirectProps) => {
    const redirect = useRef(props.redirect);
    const onSave = useRef(save);
    const formGroups = useRef<{ [key: string]: string[] }>({});
    const finalMutators = useMemo(
        () =>
            mutators === defaultMutators
                ? mutators
                : { ...defaultMutators, ...mutators },
        [mutators]
    );

    // We don't use state here for two reasons:
    // 1. There no way to execute code only after the state has been updated
    // 2. We don't want the form to rerender when redirect is changed
    const setRedirect = newRedirect => {
        redirect.current = newRedirect;
    };

    /**
     * A form can have several Save buttons. In case the user clicks on
     * a Save button with a custom onSave handler, then on a second Save button
     * without custom onSave handler, the user expects the default save
     * handler (the one of the Form) to be called.
     * That's why the SaveButton onClick calls setOnSave() with no parameters
     * if it has no custom onSave, and why this function forces a default to
     * save.
     */
    const setOnSave = useCallback(
        newOnSave => {
            typeof newOnSave === 'function'
                ? (onSave.current = newOnSave)
                : (onSave.current = save);
        },
        [save]
    );

    const formContextValue = useMemo<FormContextValue>(
        () => ({
            setOnSave,
            getGroupFields: name => formGroups.current[name] || [],
            registerGroup: name => {
                formGroups.current[name] = formGroups.current[name] || [];
            },
            unregisterGroup: name => {
                delete formGroups[name];
            },
            registerField: (source, group) => {
                if (group) {
                    const fields = new Set(formGroups.current[group] || []);
                    fields.add(source);
                    formGroups.current[group] = Array.from(fields);
                }
            },
            unregisterField: (source, group) => {
                if (group) {
                    if (!formGroups.current[group]) {
                        console.warn(`Invalid form group ${group}`);
                    } else {
                        const fields = new Set(formGroups.current[group]);
                        fields.delete(source);
                        formGroups.current[group] = Array.from(fields);
                    }
                }
            },
        }),
        [setOnSave]
    );

    const finalInitialValues = useMemo(
        () => getFormInitialValues(initialValues, defaultValue, record),
    [JSON.stringify({initialValues, defaultValue, record})]); // eslint-disable-line

    const submit = values => {
        const finalRedirect =
            typeof redirect.current === undefined
                ? props.redirect
                : redirect.current;

        if (shouldSanitizeEmptyValues) {
            const sanitizedValues = sanitizeEmptyValues(
                finalInitialValues,
                values
            );
            return onSave.current(sanitizedValues, finalRedirect);
        } else {
            return onSave.current(values, finalRedirect);
        }
    };

    return (
        <FormContextProvider value={formContextValue}>
            <Form
                key={version} // support for refresh button
                debug={debug}
                decorators={decorators}
                destroyOnUnregister={destroyOnUnregister}
                form={form}
                initialValues={finalInitialValues}
                initialValuesEqual={initialValuesEqual}
                keepDirtyOnReinitialize={keepDirtyOnReinitialize}
                mutators={finalMutators} // necessary for ArrayInput
                onSubmit={submit}
                subscription={subscription} // don't redraw entire form each time one field changes
                validate={validate}
                validateOnBlur={validateOnBlur}
                render={formProps => (
                    // @ts-ignore Ignored because of a weird error about the active prop
                    <FormView
                        {...props}
                        {...formProps}
                        record={record}
                        setRedirect={setRedirect}
                        saving={formProps.submitting || saving}
                        render={render}
                        save={save}
                        warnWhenUnsavedChanges={warnWhenUnsavedChanges}
                    />
                )}
            />
        </FormContextProvider>
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

export type FormWithRedirectSave = (
    data: Partial<RaRecord>,
    redirectTo: RedirectionSideEffect,
    options?: {
        onSuccess?: OnSuccess;
        onFailure?: OnFailure;
    }
) => void;

export interface FormWithRedirectOwnProps {
    defaultValue?: any;
    record?: RaRecord;
    redirect?: RedirectionSideEffect;
    render: FormWithRedirectRender;
    save?: FormWithRedirectSave;
    sanitizeEmptyValues?: boolean;
    saving?: boolean;
    version?: number;
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

export type SetRedirect = (redirect: RedirectionSideEffect) => void;
export type HandleSubmitWithRedirect = (
    redirect?: RedirectionSideEffect
) => void;
interface FormViewProps
    extends FormWithRedirectOwnProps,
        Omit<FormRenderProps, 'render' | 'component'> {
    handleSubmitWithRedirect?: HandleSubmitWithRedirect;
    setRedirect: SetRedirect;
    warnWhenUnsavedChanges?: boolean;
}

const FormView = ({
    render,
    warnWhenUnsavedChanges,
    setRedirect,
    ...props
}: FormViewProps) => {
    // if record changes (after a getOne success or a refresh), the form must be updated
    useInitializeFormWithRecord(props.record);
    useWarnWhenUnsavedChanges(warnWhenUnsavedChanges);
    useResetSubmitErrors();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAutomaticRefresh(props.pristine));
    }, [dispatch, props.pristine]);

    const { redirect, handleSubmit } = props;

    /**
     * We want to let developers define the redirection target from inside the form,
     * e.g. in a <SaveButton redirect="list" />.
     * This callback does two things: handle submit, and change the redirection target.
     * The actual redirection is done in save(), passed by the main controller.
     *
     * If the redirection target doesn't depend on the button clicked, it's a
     * better option to define it directly on the Form component. In that case,
     * using handleSubmit() instead of handleSubmitWithRedirect is fine.
     *
     * @example
     *
     * <Button onClick={() => handleSubmitWithRedirect('edit')}>
     *     Save and edit
     * </Button>
     */
    const handleSubmitWithRedirect = useCallback(
        (redirectTo = redirect) => {
            setRedirect(redirectTo);
            handleSubmit();
        },
        [setRedirect, redirect, handleSubmit]
    );

    return render({
        ...props,
        handleSubmitWithRedirect,
    });
};

export default FormWithRedirect;
