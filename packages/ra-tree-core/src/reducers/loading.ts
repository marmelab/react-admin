import {
    CRUD_GET_TREE_CHILDREN_NODES_LOADING,
    CRUD_GET_TREE_CHILDREN_NODES_SUCCESS,
    CRUD_GET_TREE_CHILDREN_NODES_FAILURE,
} from '../actions';

const expandedReducer = (
    previousState = {},
    { payload, requestPayload, type }
) => {
    switch (type) {
        case CRUD_GET_TREE_CHILDREN_NODES_LOADING:
            return {
                ...previousState,
                [payload]: true,
            };
        case CRUD_GET_TREE_CHILDREN_NODES_SUCCESS:
        case CRUD_GET_TREE_CHILDREN_NODES_FAILURE:
            return {
                ...previousState,
                [requestPayload]: false,
            };
        default:
            return previousState;
    }
};

export default expandedReducer;
