import { TOGGLE_NODE } from './actions';

const initialState = {};

export default (state = initialState, { type, payload }) => {
    if (type !== TOGGLE_NODE) {
        return state;
    }

    const { nodeId, fromHover } = payload;
    const currentNodeStatus = state[nodeId] ? state[nodeId].isExpanded : false;

    return {
        ...state,
        [nodeId]: { isExpanded: !currentNodeStatus, fromHover },
    };
};
