import { CRUD_CREATE_SUCCESS } from '../actions/dataActions';
import { DECREMENT_OPENED_FORMS, INCREMENT_OPENED_FORMS } from '../actions/inlineFormsActions';

const initialState = {
    openedFormsCount: 0,
    data: {},
};

export default (previousState = initialState, { type, meta, payload }) => {
    switch (type) {
    case CRUD_CREATE_SUCCESS: {
        const identifier = meta.inlineFormId;
        if (identifier) {
            return {
                ...previousState,
                data: {
                    ...previousState.data,
                    [identifier]: payload.data,
                },
            };
        }
        return previousState;
    }

    case INCREMENT_OPENED_FORMS:
        return {
            ...previousState,
            openedFormsCount: previousState.openedFormsCount + 1,
        };

    case DECREMENT_OPENED_FORMS:
        return {
            ...previousState,
            openedFormsCount: previousState.openedFormsCount - 1,
        };

    default:
        return previousState;
    }
};
