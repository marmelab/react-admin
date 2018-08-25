export const TOGGLE_NODE = 'RA/TREE/TOGGLE_NODE';

export const toggleNode = (resource, nodeId) => ({
    type: TOGGLE_NODE,
    payload: nodeId,
    meta: { resource },
});
