import { Identifier, GET_LIST } from 'ra-core';
import { GET_ROOT_NODES, GET_LEAF_NODES } from './fetch';

export const TOGGLE_NODE = 'RA/TREE/TOGGLE_NODE';
export const EXPAND_NODE = 'RA/TREE/EXPAND_NODE';
export const CLOSE_NODE = 'RA/TREE/CLOSE_NODE';

export const toggleNode = (resource: string, nodeId: Identifier) => ({
    type: TOGGLE_NODE,
    payload: nodeId,
    meta: { resource },
});

export const expandNode = (resource: string, nodeId: Identifier) => ({
    type: EXPAND_NODE,
    payload: nodeId,
    meta: { resource },
});

export const closeNode = (resource: string, nodeId: Identifier) => ({
    type: CLOSE_NODE,
    payload: nodeId,
    meta: { resource },
});

export const CRUD_GET_ROOT_NODES = 'RA/CRUD_GET_ROOT_NODES';

export const crudGetRootNodes = (resource: string) => ({
    type: CRUD_GET_ROOT_NODES,
    meta: {
        resource,
        fetch: GET_ROOT_NODES,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_GET_LEAF_NODES = 'RA/CRUD_GET_LEAF_NODES';

export const crudGetLeafNodes = (resource: string, parentId: Identifier) => ({
    type: CRUD_GET_LEAF_NODES,
    payload: { parentId },
    meta: {
        resource,
        fetch: GET_LEAF_NODES,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});
