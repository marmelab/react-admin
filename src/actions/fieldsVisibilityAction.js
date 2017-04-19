import { TOGGLE_FIELD } from '../reducer/resource/list/hiddenFields';

export const toggleVisibilityField = (resource, field) => ({
    type: TOGGLE_FIELD,
    payload: field,
    meta: { resource },
});
