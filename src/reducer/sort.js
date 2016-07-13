import { CRUD_SET_SORT, SORT_ASC, SORT_DESC } from '../list/sortActions';

const initialState = {
    field: 'id',
    order: SORT_DESC,
};

const oppositeOrder = direction => (direction === SORT_DESC ? SORT_ASC : SORT_DESC);

export default (resource) => (previousState = initialState, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_SET_SORT:
        if (payload.field === previousState.field) {
            return {
                ...previousState,
                order: oppositeOrder(previousState.order),
            };
        }
        return {
            field: payload.field,
            order: payload.order,
        };
    default:
        return previousState;
    }
};
