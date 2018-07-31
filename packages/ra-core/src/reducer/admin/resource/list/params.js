import { CRUD_CHANGE_LIST_PARAMS } from '../../../../actions/listActions';

const defaultState = {
    sort: null,
    order: null,
    page: 1,
    perPage: null,
    filter: {},
};

export default (previousState = defaultState, { type, payload }) => {
    switch (type) {
        case CRUD_CHANGE_LIST_PARAMS:
            return payload;
        default:
            return previousState;
    }
};
