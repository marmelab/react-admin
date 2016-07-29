import {
    CRUD_GET_LIST_SUCCESS,
    CRUD_GET_ONE_SUCCESS,
    CRUD_GET_MANY_SUCCESS,
    CRUD_UPDATE,
    CRUD_UPDATE_SUCCESS,
    CRUD_CREATE_SUCCESS,
    CRUD_GET_MATCHING_SUCCESS,
} from '../../actions/dataActions';

const addRecords = (newRecords = [], oldRecords) => {
    const newRecordsById = newRecords.reduce((prev, record) => {
        prev[record.id] = record;
        return prev;
    }, {});
    return {
        ...oldRecords,
        ...newRecordsById,
    };
};

export default (resource) => (previousState = {}, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_GET_LIST_SUCCESS:
        return addRecords(payload.data, previousState);
    case CRUD_GET_MANY_SUCCESS:
    case CRUD_GET_MATCHING_SUCCESS:
        return addRecords(payload, previousState);
    case CRUD_UPDATE: // replace record in edit form with edited one to avoid displaying previous record version
        return { ...previousState, [payload.id]: payload.data };
    case CRUD_GET_ONE_SUCCESS:
    case CRUD_UPDATE_SUCCESS:
    case CRUD_CREATE_SUCCESS:
        return { ...previousState, [payload.id]: payload };
    default:
        return previousState;
    }
};

export const getRecord = (state, id) => state[id];
