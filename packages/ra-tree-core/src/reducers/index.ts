import {
    CRUD_GET_TREE_ROOT_NODES_LOADING,
    CRUD_GET_TREE_ROOT_NODES_FAILURE,
    CRUD_GET_TREE_ROOT_NODES_SUCCESS,
    CRUD_GET_TREE_CHILDREN_NODES_LOADING,
    CRUD_GET_TREE_CHILDREN_NODES_FAILURE,
    CRUD_GET_TREE_CHILDREN_NODES_SUCCESS,
    EXPAND_NODE,
    CLOSE_NODE,
    TOGGLE_NODE,
} from '../actions';
import data from './data';
import nodes from './nodes';
import expanded from './expanded';
import loading from './loading';

const initialState = {};

export default (previousState = initialState, action) => {
    if (
        ![
            EXPAND_NODE,
            CLOSE_NODE,
            TOGGLE_NODE,
            CRUD_GET_TREE_ROOT_NODES_LOADING,
            CRUD_GET_TREE_ROOT_NODES_FAILURE,
            CRUD_GET_TREE_ROOT_NODES_SUCCESS,
            CRUD_GET_TREE_CHILDREN_NODES_LOADING,
            CRUD_GET_TREE_CHILDREN_NODES_FAILURE,
            CRUD_GET_TREE_CHILDREN_NODES_SUCCESS,
        ].includes(action.type)
    ) {
        return previousState;
    }

    const previousResource = previousState[action.meta.resource] || {};
    return {
        ...previousState,
        [action.meta.resource]: {
            data: data(previousResource.data, action),
            nodes: nodes(previousResource.nodes, action),
            expanded: expanded(previousResource.expanded, action),
            loading: loading(previousResource.loading, action),
        },
    };
};
