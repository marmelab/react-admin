export const getIsNodeExpanded = (state, resource, nodeId) =>
    (state[resource] && state[resource][nodeId]) || false;
