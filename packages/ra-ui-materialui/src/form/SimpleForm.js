import React, { Children, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classnames from 'classnames';
import {
    useTranslate,
    useInitializeFormWithRecord,
    sanitizeEmptyValues,
} from 'ra-core';

import getFormInitialValues from './getFormInitialValues';
import FormInput from './FormInput';
import Toolbar from './Toolbar';
import CardContentInner from '../layout/CardContentInner';

const SimpleForm = ({ initialValues, defaultValue, saving, ...props }) => {
    let redirect = useRef(props.redirect);
    // We don't use state here for two reasons:
    // 1. There no way to execute code only after the state has been updated
    // 2. We don't want the form to rerender when redirect is changed
    const setRedirect = newRedirect => {
        redirect.current = newRedirect;
    };

    const translate = useTranslate();

    const finalInitialValues = getFormInitialValues(
        initialValues,
        defaultValue,
        props.record
    );

    const submit = values => {
        const finalRedirect =
            typeof redirect.current === undefined
                ? props.redirect
                : redirect.current;
        const finalValues = sanitizeEmptyValues(finalInitialValues, values);

        props.save(finalValues, finalRedirect);
    };

    return (
        <Form
            key={props.version}
            initialValues={finalInitialValues}
            onSubmit={submit}
            mutators={{ ...arrayMutators }}
            keepDirtyOnReinitialize
            subscription={defaultSubscription}
            {...props}
            render={formProps => (
                <SimpleFormView
                    saving={formProps.submitting || saving}
                    translate={translate}
                    setRedirect={setRedirect}
                    {...props}
                    {...formProps}
                />
            )}
        />
    );
};

const defaultSubscription = {
    submitting: true,
    pristine: true,
    valid: true,
    invalid: true,
};

export default SimpleForm;

const SimpleFormView = ({
    basePath,
    children,
    className,
    invalid,
    form,
    pristine,
    record,
    redirect: defaultRedirect,
    resource,
    saving,
    setRedirect,
    submitOnEnter,
    toolbar,
    undoable,
    version,
    handleSubmit,
    variant,
    margin,
    ...rest
}) => {
    useInitializeFormWithRecord(record);

    const handleSubmitWithRedirect = useCallback(
        (redirect = defaultRedirect) => {
            setRedirect(redirect);
            handleSubmit();
        },
        [setRedirect, defaultRedirect, handleSubmit]
    );

    return (
        <form
            className={classnames('simple-form', className)}
            {...sanitizeRestProps(rest)}
        >
            <CardContentInner key={version}>
                {Children.map(children, input => (
                    <FormInput
                        basePath={basePath}
                        input={input}
                        record={record}
                        resource={resource}
                        variant={variant}
                        margin={margin}
                    />
                ))}
            </CardContentInner>
            {toolbar &&
                React.cloneElement(toolbar, {
                    basePath,
                    handleSubmitWithRedirect,
                    handleSubmit,
                    invalid,
                    pristine,
                    record,
                    redirect: defaultRedirect,
                    resource,
                    saving,
                    submitOnEnter,
                    undoable,
                })}
        </form>
    );
};

SimpleFormView.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // @deprecated
    initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    handleSubmit: PropTypes.func, // passed by react-final-form
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    undoable: PropTypes.bool,
    validate: PropTypes.func,
    version: PropTypes.number,
};

SimpleFormView.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const sanitizeRestProps = ({
    anyTouched,
    array,
    asyncBlurFields,
    asyncValidate,
    asyncValidating,
    autofill,
    blur,
    change,
    clearAsyncError,
    clearFields,
    clearSubmit,
    clearSubmitErrors,
    destroy,
    dirty,
    dirtyFields,
    dirtyFieldsSinceLastSubmit,
    dirtySinceLastSubmit,
    dispatch,
    form,
    handleSubmit,
    hasSubmitErrors,
    hasValidationErrors,
    initialize,
    initialized,
    initialValues,
    pristine,
    pure,
    redirect,
    reset,
    resetSection,
    save,
    setRedirect,
    submit,
    submitError,
    submitErrors,
    submitAsSideEffect,
    submitFailed,
    submitSucceeded,
    submitting,
    touch,
    translate,
    triggerSubmit,
    undoable,
    untouch,
    valid,
    validate,
    validating,
    _reduxForm,
    ...props
}) => props;
