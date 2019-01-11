import {
    CRUD_GET_ONE_SUCCESS,
    CRUD_GET_LIST_SUCCESS,
} from '../../../../actions/dataActions';
import { DELETE, DELETE_MANY } from '../../../../dataFetchActions';

export default (previousState = 0, { type, payload, meta }) => {
    if (type === CRUD_GET_ONE_SUCCESS) {
        return previousState == 0 ? 1 : previousState;
    }
    if (type === CRUD_GET_LIST_SUCCESS) {
        return payload.total;
    }
    if (meta && meta.optimistic) {
        if (meta.fetch === DELETE) {
            return previousState - 1;
        }
        if (meta.fetch === DELETE_MANY) {
            return previousState - payload.ids.length;
        }
    }
    return previousState;
};
