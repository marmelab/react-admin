import { CRUD_CREATE_SUCCESS } from '../actions/dataActions';

export default (previousState = {}, { type, meta, payload }) => {
    switch (type) {
    case CRUD_CREATE_SUCCESS: {
        const identifier = meta.inlineFormId;
        if (identifier) {
            return {
                ...previousState,
                [identifier]: {
                    createdRecord: payload.data,
                },
            };
        }
        return previousState;
    }

    default:
        return previousState;
    }
};
