export const INITIALIZE_FORM = 'RA/INITIALIZE_FORM';
export const RESET_FORM = 'RA/RESET_FORM';
export const BEFORE_LOCATION_CHANGE = 'RA/BEFORE_LOCATION_CHANGE';

export const initializeForm = initialValues => ({
    type: INITIALIZE_FORM,
    payload: initialValues,
});

export const resetForm = () => ({
    type: RESET_FORM,
});

export const beforeLocationChange = ({ payload, meta }) => ({
    type: BEFORE_LOCATION_CHANGE,
    payload,
    meta,
});
