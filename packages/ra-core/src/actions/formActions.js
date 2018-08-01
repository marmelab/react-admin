export const INITIALIZE_FORM = 'RA/INITIALIZE_FORM';
export const RESET_FORM = 'RA/RESET_FORM';

export const initializeForm = initialValues => ({
    type: INITIALIZE_FORM,
    payload: initialValues,
});

export const resetForm = () => ({
    type: RESET_FORM,
});
