import { CRUD_SHOW_FILTER, CRUD_HIDE_FILTER, CRUD_SET_FILTER } from '../../../../actions/filterActions';

const initialState = {
    display: {},
    values: {},
};

export default (resource) => (previousState = initialState, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_SHOW_FILTER:
        return {
            display: { ...previousState.display, [payload.field]: true },
            values: previousState.values,
        };
    case CRUD_HIDE_FILTER:
        return {
            display: { ...previousState.display, [payload.field]: false },
            values: { ...previousState.values, [payload.field]: undefined },
        };
    case CRUD_SET_FILTER:
        return {
            display: previousState.display,
            values: { ...previousState.values, [payload.field]: payload.value || undefined },
        };
    default:
        return previousState;
    }
};
