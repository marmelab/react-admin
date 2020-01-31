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
    debug,
    decorators,
    defaultValue,
    form,
    initialValuesEqual,
    keepDirtyOnReinitialize = true,
    mutators = arrayMutators as any, // FIXME see https://github.com/final-form/react-final-form/issues/704 and https://github.com/microsoft/TypeScript/issues/35771
    record,
    render,
    save,
    saving,
    subscription = defaultSubscription,
    validate,
    validateOnBlur,
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
            debug={debug}
            decorators={decorators}
            form={form}
            initialValues={finalInitialValues}
            initialValuesEqual={initialValuesEqual}
            keepDirtyOnReinitialize={keepDirtyOnReinitialize}
            mutators={mutators} // necessary for ArrayInput
            onSubmit={submit}
            subscription={subscription} // don't redraw entire form each time one field changes
            validate={validate}
            validateOnBlur={validateOnBlur}
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
