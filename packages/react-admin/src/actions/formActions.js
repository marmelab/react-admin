export const INITIALIZE_FORM = 'AOR/INITIALIZE_FORM';

export const initializeForm = initialValues => ({
    type: INITIALIZE_FORM,
    payload: initialValues,
});
