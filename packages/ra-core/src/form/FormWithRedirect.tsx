import * as React from 'react';
import { useRef, useCallback, useEffect, useMemo } from 'react';
import {
    FormProvider,
    FormState,
    SubmitHandler,
    useForm,
    UseFormProps,
} from 'react-hook-form';
import { useDispatch } from 'react-redux';

import useWarnWhenUnsavedChanges from './useWarnWhenUnsavedChanges';
import getFormInitialValues from './getFormInitialValues';
import {
    FormContextValue,
    Record as RaRecord,
    OnSuccess,
    OnFailure,
} from '../types';
import { RedirectionSideEffect } from '../sideEffect';
import { setAutomaticRefresh } from '../actions/uiActions';
import { FormContextProvider } from './FormContextProvider';
import { useDeepCompareEffect } from '../util';

/**
 * Wrapper around react-hook-form's Form to handle redirection on submit,
 * legacy defaultValue prop, and array inputs.
 *
 * Requires a render function
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
    context,
    criteriaMode,
    defaultValues,
    delayError,
    mode,
    record,
    render,
    resolver,
    reValidateMode,
    save,
    saving,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    version,
    warnWhenUnsavedChanges,
    sanitizeEmptyValues: shouldSanitizeEmptyValues = true,
    ...props
}: FormWithRedirectProps) => {
    const finalInitialValues = useMemo(
        () => getFormInitialValues(defaultValues, record),
        [JSON.stringify({ defaultValues, record })] // eslint-disable-line
    );
    const form = useForm({
        context,
        criteriaMode,
        defaultValues: finalInitialValues,
        delayError,
        mode,
        resolver,
        reValidateMode,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
    });
    const { control, handleSubmit, formState, reset } = form;
    const { isSubmitting } = formState;

    useDeepCompareEffect(() => {
        if (record) {
            reset(record);
        }
    }, [record, reset]);

    const redirect = useRef(props.redirect);
    const onSave = useRef(save);
    const formGroups = useRef<{ [key: string]: string[] }>({});

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
            control,
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
        [control, setOnSave]
    );

    const submit = handleSubmit(values => {
        const finalRedirect =
            typeof redirect.current === undefined
                ? props.redirect
                : redirect.current;

        if (shouldSanitizeEmptyValues) {
            // FIXME: This is probably unnecessary with react-hook-form
            // const sanitizedValues = sanitizeEmptyValues(
            //     finalInitialValues,
            //     values
            // );
            return onSave.current(values, finalRedirect);
        } else {
            return onSave.current(values, finalRedirect);
        }
    });

    return (
        <FormProvider {...form}>
            <FormContextProvider value={formContextValue}>
                <FormView
                    {...props}
                    {...formState}
                    handleSubmit={submit}
                    record={record}
                    setRedirect={setRedirect}
                    saving={isSubmitting || saving}
                    render={render}
                    warnWhenUnsavedChanges={warnWhenUnsavedChanges}
                />
            </FormContextProvider>
        </FormProvider>
    );
};

export type FormWithRedirectProps = FormWithRedirectOwnProps &
    Omit<UseFormProps, 'onSubmit'>;

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

export type FormWithRedirectOwnProps = Partial<FormState<any>> & {
    defaultValue?: any;
    handleSubmit?: SubmitHandler<any>;
    record?: RaRecord;
    redirect?: RedirectionSideEffect;
    render: FormWithRedirectRender;
    save?: FormWithRedirectSave;
    sanitizeEmptyValues?: boolean;
    saving?: boolean;
    version?: number;
    warnWhenUnsavedChanges?: boolean;
};

export type SetRedirect = (redirect: RedirectionSideEffect) => void;
export type HandleSubmitWithRedirect = (
    redirect?: RedirectionSideEffect
) => void;
interface FormViewProps extends FormWithRedirectOwnProps {
    handleSubmitWithRedirect?: HandleSubmitWithRedirect;
    setRedirect: SetRedirect;
    warnWhenUnsavedChanges?: boolean;
}

const FormView = ({
    render,
    warnWhenUnsavedChanges,
    save,
    setRedirect,
    ...props
}: FormViewProps) => {
    // if record changes (after a getOne success or a refresh), the form must be updated
    useWarnWhenUnsavedChanges(warnWhenUnsavedChanges);
    // useResetSubmitErrors();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAutomaticRefresh(!props.isDirty));
    }, [dispatch, props.isDirty]);

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
            // @ts-ignore
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
