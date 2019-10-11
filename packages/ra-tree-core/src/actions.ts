export const CRUD_GET_TREE_ROOT_NODES = 'RA/CRUD_GET_TREE_ROOT_NODES';
export const CRUD_GET_TREE_ROOT_NODES_SUCCESS =
    'RA/CRUD_GET_TREE_ROOT_NODES_SUCCESS';
export const CRUD_GET_TREE_ROOT_NODES_LOADING =
    'RA/CRUD_GET_TREE_ROOT_NODES_LOADING';
export const CRUD_GET_TREE_ROOT_NODES_FAILURE =
    'RA/CRUD_GET_TREE_ROOT_NODES_FAILURE';
export const GET_TREE_ROOT_NODES = 'GET_TREE_ROOT_NODES';

export const crudGetTreeRootNodes = ({
    resource,
    parentSource,
    positionSource,
}) => ({
    type: CRUD_GET_TREE_ROOT_NODES,
    meta: {
        resource,
        parentSource,
        positionSource,
        fetch: GET_TREE_ROOT_NODES,
    },
});

export const CRUD_GET_TREE_CHILDREN_NODES = 'RA/CRUD_GET_TREE_CHILDREN_NODES';
export const CRUD_GET_TREE_CHILDREN_NODES_SUCCESS =
    'RA/CRUD_GET_TREE_CHILDREN_NODES_SUCCESS';
export const CRUD_GET_TREE_CHILDREN_NODES_LOADING =
    'RA/CRUD_GET_TREE_CHILDREN_NODES_LOADING';
export const CRUD_GET_TREE_CHILDREN_NODES_FAILURE =
    'RA/CRUD_GET_TREE_CHILDREN_NODES_FAILURE';
export const GET_TREE_CHILDREN_NODES = 'GET_TREE_CHILDREN_NODES';

export const crudGetTreeChildrenNodes = ({
    resource,
    parentSource,
    positionSource,
    nodeId,
}) => ({
    type: CRUD_GET_TREE_CHILDREN_NODES,
    payload: { id: nodeId },
    meta: {
        resource,
        parentSource,
        positionSource,
        fetch: GET_TREE_CHILDREN_NODES,
    },
});

export const CRUD_MOVE_NODE = 'RA/TREE/CRUD_MOVE_NODE';
export const MOVE_NODE = 'MOVE_NODE';

export const crudMoveNode = ({
    resource,
    data,
    parentSource,
    positionSource,
    previousData,
    refresh = true,
    redirectTo,
    basePath,
}) => ({
    type: CRUD_MOVE_NODE,
    payload: {
        data,
        previousData,
    },
    meta: {
        resource,
        parentSource,
        positionSource,
        fetch: MOVE_NODE,
        onSuccess: {
            notification: {
                body: 'ra.notification.updated',
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
            refresh,
            redirectTo,
            basePath,
        },
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const TOGGLE_NODE = 'RA/TREE/TOGGLE_NODE';

export const toggleNode = ({ resource, nodeId }) => ({
    type: TOGGLE_NODE,
    payload: nodeId,
    meta: { resource },
});

export const EXPAND_NODE = 'RA/TREE/EXPAND_NODE';

export const expandNode = ({ resource, nodeId }) => ({
    type: EXPAND_NODE,
    payload: nodeId,
    meta: { resource },
});

export const CLOSE_NODE = 'RA/TREE/CLOSE_NODE';

export const closeNode = ({ resource, nodeId }) => ({
    type: CLOSE_NODE,
    payload: nodeId,
    meta: { resource },
});
