import {
    SET_LIST_SELECTED_IDS,
    TOGGLE_LIST_ITEM,
} from '../../../../actions/listActions';

const initialState = [];

export default (previousState = initialState, action) => {
    if (action.type === SET_LIST_SELECTED_IDS) {
        return action.payload;
    }

    if (action.type === TOGGLE_LIST_ITEM) {
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

    return previousState;
};
