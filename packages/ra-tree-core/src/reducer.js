import { CLOSE_NODE, TOGGLE_NODE, EXPAND_NODE } from './actions';

const initialState = {};

export default (state = initialState, { type, payload: nodeId, meta }) => {
    if (![CLOSE_NODE, TOGGLE_NODE, EXPAND_NODE].includes(type)) {
        return state;
    }
    if (!meta.resource) {
        console.warn(`The ${type} action does not have a resource meta`); // eslint-disable-line
        return state;
    }

    return {
        ...state,
        [meta.resource]: {
            ...(state[meta.resource] || {}),
            [nodeId]:
                type === TOGGLE_NODE
                    ? state[meta.resource]
                        ? !state[meta.resource][nodeId]
                        : true
                    : type === EXPAND_NODE,
        },
    };
};
