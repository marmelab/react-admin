import { DELETE, DELETE_MANY, Identifier } from 'ra-core';
import {
    CRUD_GET_TREE_ROOT_NODES_SUCCESS,
    CRUD_GET_TREE_CHILDREN_NODES_SUCCESS,
    MOVE_NODE,
} from '../actions';
import { ROOT_NODE_ID } from '../constants';

type IdentifierArray = Identifier[];

export interface IdentifierArrayWithDate extends IdentifierArray {
    fetchedAt?: Date;
}

type MapOfIdentifierArray = {
    [key: string]: IdentifierArrayWithDate | boolean;
};

type State = MapOfIdentifierArray;

const nodesReducer = (
    previousState: State = { [ROOT_NODE_ID]: [] },
    action
) => {
    if (action.meta && action.meta.optimistic) {
        if (action.meta.fetch === MOVE_NODE) {
            // We need to remove this node from its previous parent as it may have changed
            const previousParentId =
                action.payload.previousData[action.meta.parentSource] ||
                ROOT_NODE_ID;

            const newState = {
                ...previousState,
                [previousParentId]: (previousState[
                    previousParentId
                ] as IdentifierArray).filter(
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
            const idToRemove = action.payload.id;

            const newState = Object.keys(previousState).reduce((acc, id) => {
                if (id === idToRemove || acc[id] === false) {
                    return acc;
                }

                const children = acc[id] as IdentifierArray;
                const index = children.findIndex(
                    nodeId => nodeId === idToRemove
                );

                if (index === -1) {
                    return acc;
                }

                return {
                    ...acc,
                    [id]: [
                        ...children.slice(0, index),
                        ...children.slice(index + 1),
                    ],
                };
            }, previousState);

            return newState;
        }
        if (action.meta.fetch === DELETE_MANY) {
            const newState = action.payload.ids.reduce(
                (acc, idToRemove) =>
                    Object.keys(acc).reduce((acc2, id) => {
                        if (id === idToRemove || acc[id] === false) {
                            return acc2;
                        }

                        const index = acc[id].findIndex(
                            nodeId => nodeId === idToRemove
                        );

                        if (index === -1) {
                            return {
                                ...acc2,
                                [id]: acc[id],
                            };
                        }

                        return {
                            ...acc2,
                            [id]: [
                                ...acc[id].slice(0, index),
                                ...acc[id].slice(index + 1),
                            ],
                        };
                    }, {}),
                previousState
            );

            return newState;
        }
    }

    switch (action.type) {
        case CRUD_GET_TREE_ROOT_NODES_SUCCESS: {
            const newState = {
                ...previousState,
                [ROOT_NODE_ID]: action.payload.data.map(({ id }) => id),
                // Initialize the children for all root nodes if necessary
                ...action.payload.data.reduce(
                    (acc, { id }) => ({
                        ...acc,
                        [id]:
                            previousState[id] != undefined // eslint-disable-line eqeqeq
                                ? previousState[id]
                                : [],
                    }),
                    {}
                ),
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
                ...action.payload.data.reduce(
                    (acc, { id }) => ({
                        ...acc,
                        [id]:
                            previousState[id] != undefined // eslint-disable-line eqeqeq
                                ? previousState[id]
                                : [],
                    }),
                    {}
                ),
            };

            return newState;
        }
        default:
            return previousState;
    }
};

export default nodesReducer;
