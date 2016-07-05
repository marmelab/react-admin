import {
    CRUD_NEXT_PAGE,
    CRUD_PREV_PAGE,
    CRUD_FIRST_PAGE,
    CRUD_LAST_PAGE,
    CRUD_GOTO_PAGE,
} from './actions';

const initialState = {
    page: 1,
    total: 1,
};

export default (resource) => (previousState = initialState, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    switch (type) {
    case CRUD_NEXT_PAGE:
        if (previousState.page === previousState.total) {
            throw new Error('Cannot got to next page: pagination already at last page');
        }
        return { ...previousState, page: previousState.page + 1 };
    case CRUD_PREV_PAGE:
        if (previousState.page === 1) {
            throw new Error('Cannot got to previous page: pagination already at first page');
        }
        return { ...previousState, page: previousState.page - 1 };
    case CRUD_FIRST_PAGE:
        return { ...previousState, page: 1 };
    case CRUD_LAST_PAGE:
        return { ...previousState, page: previousState.total };
    case CRUD_GOTO_PAGE:
        if (payload.page > previousState.total) {
            throw new Error(`Cannot got to a page higher than total (${previousState.total})`);
        }
        if (payload.page < 1) {
            throw new Error('Cannot got to to a page lower than 1');
        }
        return { ...previousState, page: payload.page };
    default:
        return previousState;
    }
};
