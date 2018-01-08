export const INITIALIZE_FORM = 'RA/INITIALIZE_FORM';

export const initializeForm = initialValues => ({
    type: INITIALIZE_FORM,
    payload: initialValues,
});

export const FORM_SUBMIT = 'RA/FORM_SUBMIT';

export const submitForm = (resolve, reject) => ({
    type: FORM_SUBMIT,
    payload: {
        resolve,
        reject,
    },
});
