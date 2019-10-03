import { ROOT_NODE_ID } from './reducers/nodes';

export const getTreeRootNodes = (state, resource) =>
    state.tree[resource] ? state.tree[resource].nodes[ROOT_NODE_ID] : [];

export const getTreeNodes = (state, resource, ids) =>
    state.tree[resource] ? ids.map(id => state.tree[resource].data[id]) : [];

export const getChildrenNodes = (state, resource, id) =>
    state.tree[resource] ? state.tree[resource].nodes[id] : [];

export const getIsExpanded = (state, resource, id) =>
    state.tree[resource] ? state.tree[resource].expanded[id] === true : false;

export const getIsLoading = (state, resource, id) =>
    state.tree[resource] ? state.tree[resource].loading[id] === true : false;
