import { EXPAND_NODE, CLOSE_NODE, TOGGLE_NODE } from '../actions';

const expandedReducer = (previousState = {}, { payload, type }) => {
    switch (type) {
        case EXPAND_NODE:
            return {
                ...previousState,
                [payload]: true,
            };
        case CLOSE_NODE:
            return {
                ...previousState,
                [payload]: false,
            };
        case TOGGLE_NODE:
            return {
                ...previousState,
                [payload]: previousState[payload]
                    ? !previousState[payload]
                    : true,
            };
        default:
            return previousState;
    }
};

export default expandedReducer;
