import { CRUD_GET_LIST_SUCCESS, CRUD_GET_ONE_SUCCESS, CRUD_UPDATE, CRUD_UPDATE_SUCCESS } from './actions';

export default (resource) => (previousState = {}, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_GET_LIST_SUCCESS: {
        const byId = {};
        payload.data.forEach(record => {
            byId[record.id] = record;
        });
        return byId;
    }
    case CRUD_GET_ONE_SUCCESS:
    case CRUD_UPDATE: // replace record in edit form with edited one to avoid displaying previous record version
    case CRUD_UPDATE_SUCCESS:
        return { ...previousState, [payload.data.id]: payload.data };
    default:
        return previousState;
    }
};

export const getRecord = (state, id) => state[id];
