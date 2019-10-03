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
        if (action.meta.fetch === DELETE) {
            const {
                [action.payload.id]: excludedAsDeleted,
                [action.requestPayload[
                    action.meta.parentSource
                ]]: parentChildren,
                ...newState
            } = previousState;

            const index = previousState[action.meta.parentSource].findIndex(
                nodeId => nodeId === action.payload.id
            );

            newState[action.meta.parentSource] = [
                ...previousState[action.meta.parentSource].slice(0, index),
                ...previousState[action.meta.parentSource].slice(index + 1),
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
                        [action.meta.parentSource.toString()]: parentId = ROOT_NODE_ID,
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
                [ROOT_NODE_ID]: action.payload.data.map(({ id }) => id),
                ...action.payload.data.reduce(
                    (acc, { id }) => ({ ...acc, [id]: [] }),
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
                [action.requestPayload.toString()]: action.payload.data.map(
                    ({ id }) => id
                ),
                ...action.payload.data.reduce(
                    (acc, { id }) => ({ ...acc, [id]: [] }),
                    {}
                ),
            };

            Object.defineProperty(newState, 'fetchedAt', {
                value: previousState.fetchedAt,
            });

            return newState;
        }
        // case CRUD_GET_MANY_SUCCESS:
        // case CRUD_GET_MANY_REFERENCE_SUCCESS:
        //     return addRecordIds(
        //         action.payload.data
        //             .map(({ id }) => id)
        //             .filter(id => previousState.indexOf(id) !== -1),
        //         previousState
        //     );
        // case CRUD_GET_ONE_SUCCESS:
        // case CRUD_CREATE_SUCCESS:
        // case CRUD_UPDATE_SUCCESS:
        //     return addRecordIds([action.payload.data.id], previousState);
        default:
            return previousState;
    }
};

export default nodesReducer;
