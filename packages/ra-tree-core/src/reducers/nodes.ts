import {
    CRUD_GET_LIST_SUCCESS,
    CRUD_GET_MANY_SUCCESS,
    CRUD_GET_MANY_REFERENCE_SUCCESS,
    CRUD_GET_ONE_SUCCESS,
    CRUD_CREATE_SUCCESS,
    CRUD_UPDATE_SUCCESS,
    DELETE,
    DELETE_MANY,
    getFetchedAt,
    Identifier,
} from 'ra-core';
import uniq from 'lodash/uniq';
import {
    CRUD_GET_TREE_ROOT_NODES_SUCCESS,
    CRUD_GET_TREE_CHILDREN_NODES_SUCCESS,
    MOVE_NODE,
} from '../actions';

export const ROOT_NODE_ID = '@@ROOT_NODE_ID';

type IdentifierArray = Identifier[];

export interface IdentifierArrayWithDate extends IdentifierArray {
    fetchedAt?: Date;
}

type MapOfIdentifierArray = {
    [key: string]: IdentifierArrayWithDate;
};

type State = MapOfIdentifierArray;

const nodesReducer = (
    previousState: State = { [ROOT_NODE_ID]: [] },
    action
) => {
    if (action.meta && action.meta.optimistic) {
        if (action.meta.fetch === MOVE_NODE) {
            // We need to remove this node from its previous parent as it may have change
            const previousParentId =
                action.payload.previousData[action.meta.parentSource] ||
                ROOT_NODE_ID;

            const newState = {
                ...previousState,
                [previousParentId]: previousState[previousParentId].filter(
                    id => id !== action.payload.data.id
                ),
            };

            const newParentId =
                action.payload.data[action.meta.parentSource] || ROOT_NODE_ID;
            // The new parent may not have any children yet
            const currentParentChildren = newState[newParentId] || [];

            if (action.meta.positionSource) {
                // Then we need to update the new parent (which may be the same) and the node position
                newState[newParentId] = [
                    ...currentParentChildren.slice(
                        0,
                        action.payload.data[action.meta.positionSource]
                    ),
                    action.payload.data.id,
                    ...currentParentChildren.slice(
                        action.payload.data[action.meta.positionSource]
                    ),
                ];
                return newState;
            }

            newState[newParentId] = [
                ...currentParentChildren,
                action.payload.data.id,
            ];

            return newState;
        }

        if (action.meta.fetch === DELETE) {
            const parentId =
                action.payload.previousData[action.meta.parentSource] ||
                ROOT_NODE_ID;

            const {
                [action.payload.id]: excludedAsDeleted,
                [parentId]: parentChildren,
                ...newState
            } = previousState;

            const index = previousState[parentId].findIndex(
                nodeId => nodeId === action.payload.id
            );

            newState[parentId] = [
                ...previousState[parentId].slice(0, index),
                ...previousState[parentId].slice(index + 1),
            ];

            Object.defineProperty(newState, 'fetchedAt', {
                value: previousState.fetchedAt,
            });

            return newState;
        }
        if (action.meta.fetch === DELETE_MANY) {
            const newState = action.payload.ids.reduce(
                (acc, idToRemove) =>
                    Object.keys(acc).reduce((acc, id) => {
                        if (id === idToRemove) {
                            return acc;
                        }

                        const index = acc[id].findIndex(
                            nodeId => nodeId === idToRemove
                        );

                        if (index === -1) {
                            return acc;
                        }

                        return {
                            ...acc,
                            [id]: [
                                ...acc[id].slice(0, index),
                                ...acc[id].slice(index + 1),
                            ],
                        };
                    }, {}),
                previousState
            );

            Object.defineProperty(newState, 'fetchedAt', {
                value: previousState.fetchedAt,
            });

            return newState;
        }
    }

    switch (action.type) {
        case CRUD_GET_LIST_SUCCESS: {
            const newState = action.payload.data.reduce(
                (
                    acc,
                    {
                        // @ts-ignore
                        [action.meta.parentSource]: parentId = ROOT_NODE_ID,
                        id,
                    }
                ) => ({
                    ...acc,
                    [parentId]: Array.from(new Set([...acc[parentId], id])),
                }),
                {
                    ...previousState,
                    ...action.payload.data.reduce(
                        (acc, { id }) => ({ ...acc, [id]: [] }),
                        {}
                    ),
                }
            );

            Object.defineProperty(newState, 'fetchedAt', {
                value: previousState.fetchedAt,
            });

            return newState;
        }
        case CRUD_GET_TREE_ROOT_NODES_SUCCESS: {
            const newState = {
                ...previousState,
                [ROOT_NODE_ID]: action.payload.data.map(({ id }) => id),
                // Initialize the children for all root nodes if necessary
                ...action.payload.data.reduce(
                    (acc, { id }) => ({
                        ...acc,
                        [id]:
                            previousState[id] != undefined // eslint-disable-line
                                ? previousState[id]
                                : [],
                    }),
                    {}
                ),
            };

            Object.defineProperty(newState, 'fetchedAt', {
                value: previousState.fetchedAt,
            });

            return newState;
        }
        case CRUD_GET_TREE_CHILDREN_NODES_SUCCESS: {
            const newState = {
                ...previousState,
                [action.requestPayload]:
                    // The children value for this node may be false to indicate we fetched them but found none
                    action.payload.total > 0
                        ? action.payload.data.map(({ id }) => id)
                        : false,
                // Initialize the children for all the children nodes if necessary
                ...action.payload.data.reduce(
                    (acc, { id }) => ({
                        ...acc,
                        [id]:
                            previousState[id] != undefined // eslint-disable-line
                                ? previousState[id]
                                : [],
                    }),
                    {}
                ),
            };

            Object.defineProperty(newState, 'fetchedAt', {
                value: previousState.fetchedAt,
            });

            return newState;
        }
        case CRUD_CREATE_SUCCESS: {
            const newParentId =
                action.payload.data[action.meta.parentSource] || ROOT_NODE_ID;

            // The new parent may not have any children yet
            const currentParentChildren = previousState[newParentId] || [];

            if (action.meta.positionSource) {
                return {
                    ...previousState,
                    [newParentId]: [
                        ...currentParentChildren.slice(
                            0,
                            action.payload.data[action.meta.positionSource]
                        ),
                        action.payload.data.id,
                        ...currentParentChildren.slice(
                            action.payload.data[action.meta.positionSource] + 1
                        ),
                    ],
                };
            }

            return {
                ...previousState,
                [newParentId]: [
                    ...currentParentChildren,
                    action.payload.data.id,
                ],
            };
        }
        case CRUD_UPDATE_SUCCESS: {
            // We need to remove this node from its previous parent as it may have change
            const previousParentId =
                action.payload.previousData[action.meta.parentSource] ||
                ROOT_NODE_ID;

            const newState = {
                ...previousState,
                [previousParentId]: previousState[previousParentId].filter(
                    id => id !== action.payload.data.id
                ),
            };

            const newParentId =
                action.payload.data[action.meta.parentSource] || ROOT_NODE_ID;
            // The new parent may not have any children yet
            const currentParentChildren = newState[newParentId] || [];

            if (action.meta.positionSource) {
                // Then we need to update the new parent (which may be the same) and the node position
                newState[newParentId] = [
                    ...currentParentChildren.slice(
                        0,
                        action.payload.data[action.meta.positionSource]
                    ),
                    action.payload.data.id,
                    ...currentParentChildren.slice(
                        action.payload.data[action.meta.positionSource]
                    ),
                ];
                return newState;
            }

            newState[newParentId] = [
                ...currentParentChildren,
                action.payload.data.id,
            ];

            return newState;
        }
        default:
            return previousState;
    }
};

export default nodesReducer;
