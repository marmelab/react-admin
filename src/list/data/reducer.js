import { CRUD_FETCH_SUCCESS, GET_MANY } from '../../data/actions';

export default (resource) => (previousState = [], { type, payload, meta }) => {
    if (!meta || meta.resource !== resource || type !== CRUD_FETCH_SUCCESS) {
        return previousState;
    }
    switch (payload.method) {
    case GET_MANY:
        return payload.data.map(record => record.id);
    default:
        return previousState;
    }
};

export const getIds = (state) => state;
