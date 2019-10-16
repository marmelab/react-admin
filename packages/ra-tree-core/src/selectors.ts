import { ROOT_NODE_ID } from './constants';

/**
 * Get the identifiers of the root nodes which are stored under the ROOT_NODE_ID
 * in the nodes reducer map
 * @returns An array of identifiers
 */
export const getTreeRootNodes = (state, resource) =>
    state.tree[resource] ? state.tree[resource].nodes[ROOT_NODE_ID] : [];

/**
 * Get the identifiers of the children of the node specified by its identifier
 * @returns Either an array of identifier of `false` to indicate we fetched them but found none
 */
export const getChildrenNodes = (state, resource, id) =>
    state.tree[resource] && state.tree[resource].nodes[id] != undefined // eslint-disable-line
        ? state.tree[resource].nodes[id]
        : [];

/**
 * Get the nodes specified by their identifiers
 * @returns An array of records
 */
export const getTreeNodes = (state, resource, ids) =>
    state.tree[resource] && ids
        ? ids.map(id => state.tree[resource].data[id])
        : [];

export const getIsExpanded = (state, resource, id) =>
    state.tree[resource] ? state.tree[resource].expanded[id] === true : false;

export const getIsLoading = (state, resource, id) =>
    state.tree[resource] ? state.tree[resource].loading[id] === true : false;
