import React, { Children, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';

import FormInput from './FormInput';
import Toolbar from './Toolbar';
import CardContentInner from '../layout/CardContentInner';

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

export const SimpleForm = ({
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
    ...rest
}) => {
    useEffect(() => {
        if (!record) {
            return;
        }

        form.batch(() => {
            Object.keys(record).forEach(key => {
                form.change(key, record[key]);
            });
        });
    }, []); // eslint-disable-line

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

SimpleForm.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
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

SimpleForm.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const EnhancedSimpleForm = ({ initialValues, ...props }) => {
    let redirect;
    // We don't use state here for two reasons:
    // 1. There no way to execute code only after the state has been updated
    // 2. We don't want the form to rerender when redirect is changed
    const setRedirect = newRedirect => {
        redirect = newRedirect;
    };

    const saving = useSelector(state => state.admin.saving);
    const translate = useTranslate();
    const submit = values => {
        const finalRedirect =
            typeof redirect === undefined ? props.redirect : redirect;
        props.save(values, finalRedirect);
    };

    const finalInitialValues = {
        ...initialValues,
        ...props.record,
    };

    return (
        <Form
            key={props.version}
            initialValues={finalInitialValues}
            onSubmit={submit}
            mutators={{ ...arrayMutators }}
            keepDirtyOnReinitialize
            destroyOnUnregister
            {...props}
            render={({ submitting, ...formProps }) => (
                <SimpleForm
                    saving={submitting || saving}
                    translate={translate}
                    setRedirect={setRedirect}
                    {...props}
                    {...formProps}
                />
            )}
        />
    );
};

export default EnhancedSimpleForm;
