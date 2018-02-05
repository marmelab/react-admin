export const resourceSanitizer = ({ basePath, resource, ...rest }) => rest;

export const translateSanitizer = ({ locale, translate, ...rest }) => rest;

export const formSanitizer = ({
    clearSubmitErrors,
    defaultRenderer,
    submitOnEnter,
    save,
    validate,
    ...rest
}) => rest;

export const reduxFormSanitizer = ({
    anyTouched,
    array,
    asyncValidate,
    asyncValidating,
    autofill,
    blur,
    change,
    clearAsyncError,
    clearSubmit,
    destroy,
    dirty,
    dispatch,
    error,
    form,
    handleSubmit,
    initialize,
    initialized,
    initialValues,
    invalid,
    pristine,
    pure,
    reset,
    submit,
    submitFailed,
    submitSucceeded,
    submitting,
    touch,
    triggerSubmit,
    untouch,
    valid,
    warning,
    ...rest
}) => rest;
