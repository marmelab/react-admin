export const TOGGLE_NODE = 'RA/TREE/TOGGLE_NODE';
export const EXPAND_NODE = 'RA/TREE/EXPAND_NODE';
export const CLOSE_NODE = 'RA/TREE/CLOSE_NODE';

export const toggleNode = (resource, nodeId) => ({
    type: TOGGLE_NODE,
    payload: nodeId,
    meta: { resource },
});

export const expandNode = (resource, nodeId) => ({
    type: EXPAND_NODE,
    payload: nodeId,
    meta: { resource },
});

export const closeNode = (resource, nodeId) => ({
    type: CLOSE_NODE,
    payload: nodeId,
    meta: { resource },
});
