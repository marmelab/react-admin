import { DELETE, DELETE_MANY } from 'ra-core';
import nodesReducer from './nodes';
import {
    CRUD_GET_TREE_ROOT_NODES_SUCCESS,
    CRUD_GET_TREE_CHILDREN_NODES_SUCCESS,
    MOVE_NODE,
} from '../actions';
import { ROOT_NODE_ID } from '../constants';

describe('nodes reducer', () => {
    test('Populates the tree by initializing the root nodes on CRUD_GET_TREE_ROOT_NODES_SUCCESS without loosing already loaded data', () => {
        expect(
            nodesReducer(
                {
                    [ROOT_NODE_ID]: ['node1'],
                    node1: ['node3'],
                },
                {
                    type: CRUD_GET_TREE_ROOT_NODES_SUCCESS,
                    payload: {
                        data: [
                            {
                                id: 'node1',
                            },
                            {
                                id: 'node2',
                            },
                        ],
                    },
                }
            )
        ).toEqual({
            [ROOT_NODE_ID]: ['node1', 'node2'],
            node1: ['node3'],
            node2: [],
        });
    });
    test("Populates a node's leaves and initialize the new nodes on CRUD_GET_TREE_CHILDREN_NODES_SUCCESS without loosing already loaded data", () => {
        expect(
            nodesReducer(
                {
                    [ROOT_NODE_ID]: ['node1'],
                    node1: ['node3'],
                    node2: ['node4'],
                },
                {
                    type: CRUD_GET_TREE_CHILDREN_NODES_SUCCESS,
                    requestPayload: {
                        id: 'node1',
                    },
                    payload: {
                        data: [
                            {
                                id: 'node2',
                            },
                            {
                                id: 'node3',
                            },
                        ],
                    },
                }
            )
        ).toEqual({
            [ROOT_NODE_ID]: ['node1'],
            node1: ['node2', 'node3'],
            node2: ['node4'],
            node3: [],
        });
    });
    test("Set the node's leaves as false on CRUD_GET_TREE_CHILDREN_NODES_SUCCESS if there are no children", () => {
        expect(
            nodesReducer(
                {
                    [ROOT_NODE_ID]: ['node1'],
                    node1: ['node3'],
                    node2: ['node4'],
                },
                {
                    type: CRUD_GET_TREE_CHILDREN_NODES_SUCCESS,
                    requestPayload: {
                        id: 'node1',
                    },
                    payload: {
                        data: [],
                    },
                }
            )
        ).toEqual({
            [ROOT_NODE_ID]: ['node1'],
            node1: false,
            node2: ['node4'],
        });
    });
    test("Correctly a node's previous and new parents on MOVE_NODE", () => {
        expect(
            nodesReducer(
                {
                    [ROOT_NODE_ID]: ['node1', 'node2'],
                    node1: ['node3'],
                    node2: ['node4'],
                },
                {
                    payload: {
                        previousData: {
                            id: 'node3',
                            parent_id: 'node1',
                        },
                        data: {
                            id: 'node3',
                            parent_id: 'node2',
                        },
                    },
                    meta: {
                        optimistic: true,
                        fetch: MOVE_NODE,
                        parentSource: 'parent_id',
                    },
                }
            )
        ).toEqual({
            [ROOT_NODE_ID]: ['node1', 'node2'],
            node1: [],
            node2: ['node4', 'node3'],
        });
    });
    test("Correctly update a node's parent on MOVE_NODE when position changes", () => {
        expect(
            nodesReducer(
                {
                    [ROOT_NODE_ID]: ['node1'],
                    node1: ['node3', 'node4'],
                },
                {
                    payload: {
                        previousData: {
                            id: 'node3',
                            parent_id: 'node1',
                            position: 0,
                        },
                        data: {
                            id: 'node3',
                            parent_id: 'node1',
                            position: 1,
                        },
                    },
                    meta: {
                        optimistic: true,
                        fetch: MOVE_NODE,
                        parentSource: 'parent_id',
                        positionSource: 'position',
                    },
                }
            )
        ).toEqual({
            [ROOT_NODE_ID]: ['node1'],
            node1: ['node4', 'node3'],
        });
    });
    test('Correctly remove a node from its parent on DELETE', () => {
        expect(
            nodesReducer(
                {
                    [ROOT_NODE_ID]: ['node1'],
                    node1: ['node3', 'node4'],
                },
                {
                    payload: {
                        id: 'node3',
                    },
                    meta: {
                        optimistic: true,
                        fetch: DELETE,
                        parentSource: 'parent_id',
                    },
                }
            )
        ).toEqual({
            [ROOT_NODE_ID]: ['node1'],
            node1: ['node4'],
        });
    });
    test('Correctly remove nodes from their parent on DELETE', () => {
        expect(
            nodesReducer(
                {
                    [ROOT_NODE_ID]: ['node1', 'node2'],
                    node1: ['node4', 'node3'],
                    node2: ['node5', 'node6'],
                    node3: ['node7'],
                    node5: false,
                },
                {
                    payload: {
                        ids: ['node3', 'node5'],
                    },
                    meta: {
                        optimistic: true,
                        fetch: DELETE_MANY,
                        parentSource: 'parent_id',
                    },
                }
            )
        ).toEqual({
            [ROOT_NODE_ID]: ['node1', 'node2'],
            node1: ['node4'],
            node2: ['node6'],
        });
    });
});
