export const getIsNodeExpanded = (state, resource, nodeId) =>
    (state[resource] && state[resource][nodeId]) || false;

export const getExpandedNodeIds = (state, resource) =>
    state[resource]
        ? Object.keys(state[resource]).filter(
              key => state[resource][key] === true
          )
        : [];
