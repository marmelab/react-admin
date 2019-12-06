import React, { useRef, useCallback } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import useInitializeFormWithRecord from './useInitializeFormWithRecord';
import sanitizeEmptyValues from './sanitizeEmptyValues';
import getFormInitialValues from './getFormInitialValues';

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
 * @typedef {object} Props the props you can use (other props are injected by Create or Edit)
 * @prop {object} initialValues
 * @prop {function} validate
 * @prop {boolean} submitOnEnter
 * @prop {string} redirect
 *
 * @param {Prop} props
 */
const FormWithRedirect = ({
    initialValues,
    defaultValue,
    record,
    render,
    save,
    saving,
    version,
    ...props
}) => {
    let redirect = useRef(props.redirect);
    // We don't use state here for two reasons:
    // 1. There no way to execute code only after the state has been updated
    // 2. We don't want the form to rerender when redirect is changed
    const setRedirect = newRedirect => {
        redirect.current = newRedirect;
    };

    const finalInitialValues = getFormInitialValues(
        initialValues,
        defaultValue,
        record
    );

    const submit = values => {
        const finalRedirect =
            typeof redirect.current === undefined
                ? props.redirect
                : redirect.current;
        const finalValues = sanitizeEmptyValues(finalInitialValues, values);

        save(finalValues, finalRedirect);
    };

    return (
        <Form
            key={version} // support for refresh button
            initialValues={finalInitialValues}
            onSubmit={submit}
            mutators={{ ...arrayMutators }} // necessary for ArrayInput
            keepDirtyOnReinitialize
            subscription={defaultSubscription} // don't redraw entire form each time one field changes
        >
            {formProps => (
                <FormView
                    {...props}
                    {...formProps}
                    record={record}
                    setRedirect={setRedirect}
                    saving={formProps.submitting || saving}
                    render={render}
                />
            )}
        </Form>
    );
};

const defaultSubscription = {
    submitting: true,
    pristine: true,
    valid: true,
    invalid: true,
};

const FormView = ({ render, ...props }) => {
    // if record changes (after a getOne success or a refresh), the form must be updated
    useInitializeFormWithRecord(props.record);

    const { redirect, setRedirect, handleSubmit } = props;

    /**
     * We want to allow developers to define the redirect from inside the form,
     * e.g. in a <SaveButton redirect="list" />. So we must pass a function
     * doing bot hsubmit and redirect, defaulting to the redirect defined in the form.
     */
    const handleSubmitWithRedirect = useCallback(
        (redirectTo = redirect) => {
            setRedirect(redirectTo);
            handleSubmit();
        },
        [setRedirect, redirect, handleSubmit]
    );

    return (
        <form>
            {render({
                ...props,
                handleSubmitWithRedirect,
            })}
        </form>
    );
};

export default FormWithRedirect;
