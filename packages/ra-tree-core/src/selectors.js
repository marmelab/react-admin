export const getIsNodeExpanded = (state, nodeId) => {
    const nodeStatus = state[nodeId] || {
        isExpanded: false,
        fromHover: false,
    };
    return nodeStatus.isExpanded;
};
