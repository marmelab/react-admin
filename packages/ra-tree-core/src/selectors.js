export const getIsNodeExpanded = (state, nodeId) => {
    const nodeStatus = state.expanded[nodeId] || {
        isExpanded: false,
        fromHover: false,
    };
    return nodeStatus.isExpanded;
};

export const getIsNodeExpandedFromHover = (state, nodeId) => {
    const nodeStatus = state.expanded[nodeId] || {
        isExpanded: false,
        fromHover: false,
    };
    return nodeStatus.fromHover;
};
