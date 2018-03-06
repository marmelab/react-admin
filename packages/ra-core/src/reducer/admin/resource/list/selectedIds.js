import {
    SET_LIST_SELECTED_IDS,
    TOGGLE_LIST_ITEM,
} from '../../../../actions/listActions';
import {
    CRUD_DELETE_MANY_OPTIMISTIC,
    CRUD_UPDATE_MANY_OPTIMISTIC,
} from '../../../../actions/dataActions';

const initialState = [];

export default (previousState = initialState, action) => {
    switch (action.type) {
        case SET_LIST_SELECTED_IDS:
            return action.payload;
        case TOGGLE_LIST_ITEM: {
            let index = previousState.indexOf(action.payload);
            if (index > -1) {
                return [
                    ...previousState.slice(0, index),
                    ...previousState.slice(index + 1),
                ];
            } else {
                return [...previousState, action.payload];
            }
        }
        case CRUD_DELETE_MANY_OPTIMISTIC:
        case CRUD_UPDATE_MANY_OPTIMISTIC:
            return action.payload.unselectAll ? initialState : previousState;
        default:
            return previousState;
    }
};
