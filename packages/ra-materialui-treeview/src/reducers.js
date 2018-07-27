import { TOGGLE_NODE } from './actions';

const initialState = {};

export default (state = initialState, { type, payload: nodeId }) => {
    if (type !== TOGGLE_NODE) {
        return state;
    }

    return {
        ...state,
        [nodeId]: !state[nodeId],
    };
};

export const getIsNodeExpanded = (state, node) => !!state.ra_treeview[node.id];
