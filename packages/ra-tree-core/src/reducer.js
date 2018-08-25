import { TOGGLE_NODE } from './actions';

const initialState = {};

export default (state = initialState, { type, payload: nodeId, meta }) => {
    if (type !== TOGGLE_NODE) {
        return state;
    }
    if (!meta.resource) {
        console.warn(`The TOGGLE_NODE action does not have a resource meta`); // eslint-disable-line
        return state;
    }

    let newState = { ...state };
    if (!newState[meta.resource]) {
        newState = {
            ...newState,
            [meta.resource]: {},
        };
    }

    return {
        ...newState,
        [meta.resource]: {
            ...newState[meta.resource],
            [nodeId]: !newState[meta.resource][nodeId],
        },
    };
};
