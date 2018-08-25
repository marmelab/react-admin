export const TOGGLE_NODE = 'RA/TREE/TOGGLE_NODE';

export const toggleNode = (nodeId, fromHover = false) => ({
    type: TOGGLE_NODE,
    payload: { nodeId, fromHover },
});
