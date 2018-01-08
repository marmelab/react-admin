import React from 'react';
import { propTypes as formPropTypes } from 'redux-form';

const SanitizedForm = ({
    anyTouched,
    asyncValidate,
    asyncValidating,
    clearSubmit,
    dirty,
    handleSubmit,
    initialized,
    initialValues,
    pristine,
    submitting,
    submitFailed,
    submitSucceeded,
    valid,
    pure,
    triggerSubmit,
    clearSubmitErrors,
    clearAsyncError,
    blur,
    change,
    destroy,
    dispatch,
    initialize,
    reset,
    invalid,
    touch,
    untouch,
    validate,
    save,
    translate,
    autofill,
    submit,
    resource,
    redirect,
    array,
    ...props
}) => <form {...props} />;

SanitizedForm.propTypes = {
    ...formPropTypes,
};

export default SanitizedForm;
