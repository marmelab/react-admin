import { DELETE, DELETE_MANY, Identifier } from 'ra-core';
import {
    CRUD_GET_TREE_ROOT_NODES_SUCCESS,
    CRUD_GET_TREE_CHILDREN_NODES_SUCCESS,
    MOVE_NODE,
} from '../actions';
import { ROOT_NODE_ID } from '../constants';

type MapOfIdentifierArray = {
    [key: string]: Identifier[] | boolean;
};

type State = MapOfIdentifierArray;

/**
 * This reducer maintains a map of all nodes (using their id) and their children (only their id too).
 * Root nodes are persisted as the children of a special node which has the identifier ROOT_NODE_ID
 * @example
 * {
 *     ROOT_NODE_ID: [1, 2],
 *     1: [3, 4],
 *     2: [5, 6],
 * }
 */
const nodesReducer = (
    previousState: State = { [ROOT_NODE_ID]: [] },
    action
) => {
    if (action.meta && action.meta.optimistic) {
        if (action.meta.fetch === MOVE_NODE) {
            return moveNode(previousState, action);
        }

        if (action.meta.fetch === DELETE) {
            return removeNodes(previousState, [action.payload.id]);
        }
        if (action.meta.fetch === DELETE_MANY) {
            return removeNodes(previousState, action.payload.ids);
        }
    }

    switch (action.type) {
        case CRUD_GET_TREE_ROOT_NODES_SUCCESS: {
            const newState = {
                ...previousState,
                [ROOT_NODE_ID]: action.payload.data.map(({ id }) => id),
                // Initialize the children for all root nodes if necessary
                ...setupNodesChildren(previousState, action.payload.data),
            };

            return newState;
        }
        case CRUD_GET_TREE_CHILDREN_NODES_SUCCESS: {
            const newState = {
                ...previousState,
                [action.requestPayload.id]:
                    // The children value for this node may be false to indicate we fetched them but found none
                    action.payload.data.length > 0
                        ? action.payload.data.map(({ id }) => id)
                        : false,
                // Initialize the children for all the children nodes if necessary
                ...setupNodesChildren(previousState, action.payload.data),
            };

            return newState;
        }
        default:
            return previousState;
    }
};

export default nodesReducer;

const setupNodesChildren = (previousState: State, nodes) =>
    nodes.reduce(
        (acc, { id }) => ({
            ...acc,
            [id]:
                previousState[id] != undefined // eslint-disable-line eqeqeq
                    ? previousState[id]
                    : [],
        }),
        {}
    );

const moveNode = (previousState: State, action) => {
    // We need to remove this node from its previous parent as it may have changed
    const previousParentId =
        action.payload.previousData[action.meta.parentSource] || ROOT_NODE_ID;

    const updatedPreviousParent = (previousState[
        previousParentId
    ] as Identifier[]).filter(id => id !== action.payload.data.id);

    const newState = {
        ...previousState,
        [previousParentId]: updatedPreviousParent,
    };

    // Then we need to update the new parent (which may be the same)
    const newParentId =
        action.payload.data[action.meta.parentSource] || ROOT_NODE_ID;
    // The new parent may not have any child yet
    const currentParentChildren = newState[newParentId] || [];

    // We may have to update the node position
    if (action.meta.positionSource) {
        const childrenBeforeMovedNode = currentParentChildren.slice(
            0,
            action.payload.data[action.meta.positionSource]
        );

        const childrenAfterMovedNode = currentParentChildren.slice(
            action.payload.data[action.meta.positionSource]
        );

        newState[newParentId] = [
            ...childrenBeforeMovedNode,
            action.payload.data.id,
            ...childrenAfterMovedNode,
        ];
        return newState;
    }

    // Otherwise, we just append the moved node to its new parent
    newState[newParentId] = [...currentParentChildren, action.payload.data.id];

    return newState;
};

const removeNodes = (previousState: State, idsToRemove: Identifier[]) =>
    idsToRemove.reduce(
        (newState, idToRemove) =>
            // Traverse all registered nodes and remove the node from their children
            Object.keys(newState).reduce((acc, id) => {
                // If this is a removed node or this node has no children (false indicates we fetched them but found none)
                if (id === idToRemove || newState[id] === false) {
                    return acc;
                }

                const children = newState[id] as Identifier[];

                const index = children.findIndex(
                    nodeId => nodeId === idToRemove
                );

                if (index === -1) {
                    return {
                        ...acc,
                        [id]: children,
                    };
                }

                return {
                    ...acc,
                    [id]: [
                        ...children.slice(0, index),
                        ...children.slice(index + 1),
                    ],
                };
            }, {}),
        previousState
    );
