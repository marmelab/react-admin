export const getIsNodeExpanded = (state, resource, nodeId) =>
    (state[resource] && state[resource][nodeId]) || false;

export const getExpandedNodeIds = (state, resource) =>
    state[resource]
        ? Object.keys(state[resource]).filter(
              key => state[resource][key] === true
          )
        : [];

export const getTree = (state, resource, parentSource, getTreeFromArray) => {
    if (!state.tree[resource]) {
        return null;
    }

    const availableData = state.tree[resource].ids.reduce(
        (acc, id) => acc.concat(state.tree[resource].data[id]),
        []
    );
    const expandedNodeIds = getExpandedNodeIds(state.tree, resource);

    const tree = getTreeFromArray(
        Object.values(availableData),
        parentSource,
        expandedNodeIds
    );

    return tree;
};
