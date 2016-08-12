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
    case CRUD_HIDE_FILTER: {
        const values = { ...previousState.values };
        delete values[payload.field];
        return {
            display: { ...previousState.display, [payload.field]: false },
            values,
        };
    }
    case CRUD_SET_FILTER: {
        const values = { ...previousState.values };
        if (payload.value) {
            values[payload.field] = payload.value;
        } else {
            delete values[payload.field];
        }
        return {
            display: previousState.display,
            values,
        };
    }
    default:
        return previousState;
    }
};
