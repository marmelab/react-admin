import assert from 'assert';
import reducer, { getReferenceResource } from './index';
import { REGISTER_RESOURCE, UNREGISTER_RESOURCE } from '../../../actions';
import { CRUD_CHANGE_LIST_PARAMS } from '../../../actions/listActions';

describe('Resources Reducer', () => {
    it('should return previous state if the action has no resource meta and is not REGISTER_RESOURCE nor UNREGISTER_RESOURCE', () => {
        const previousState = { previous: true };
        assert.deepEqual(
            reducer(previousState, { type: 'A_TYPE', meta: { foo: 'bar' } }),
            previousState
        );
    });

    it('should initialize a new resource upon REGISTER_RESOURCE', () => {
        assert.deepEqual(
            reducer(
                {
                    posts: {
                        data: {},
                        list: {
                            ids: [],
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            selectedIds: [],
                            total: 0,
                            loadedOnce: false,
                        },
                        props: { name: 'posts' },
                    },
                    comments: {
                        data: {},
                        list: {
                            ids: [],
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            selectedIds: [],
                            total: 0,
                            loadedOnce: false,
                        },
                        props: { name: 'comments' },
                    },
                },
                {
                    type: REGISTER_RESOURCE,
                    payload: {
                        name: 'users',
                        options: 'foo',
                    },
                }
            ),
            {
                posts: {
                    data: {},
                    list: {
                        ids: [],
                        params: {
                            filter: {},
                            order: null,
                            page: 1,
                            perPage: null,
                            sort: null,
                        },
                        selectedIds: [],
                        total: 0,
                        loadedOnce: false,
                    },
                    props: { name: 'posts' },
                },
                comments: {
                    data: {},
                    list: {
                        ids: [],
                        params: {
                            filter: {},
                            order: null,
                            page: 1,
                            perPage: null,
                            sort: null,
                        },
                        selectedIds: [],
                        total: 0,
                        loadedOnce: false,
                    },
                    props: { name: 'comments' },
                },
                users: {
                    data: {},
                    list: {
                        ids: [],
                        params: {
                            filter: {},
                            order: null,
                            page: 1,
                            perPage: null,
                            sort: null,
                        },
                        selectedIds: [],
                        total: 0,
                        loadedOnce: false,
                    },
                    props: { name: 'users', options: 'foo' },
                },
            }
        );
    });

    it('should remove a resource upon UNREGISTER_RESOURCE', () => {
        assert.deepEqual(
            reducer(
                {
                    posts: {
                        data: {},
                        list: {
                            ids: [],
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            selectedIds: [],
                            total: 0,
                            loadedOnce: false,
                        },
                        props: { name: 'posts' },
                    },
                    comments: {
                        data: {},
                        list: {
                            ids: [],
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            selectedIds: [],
                            total: 0,
                            loadedOnce: false,
                        },
                        props: { name: 'comments' },
                    },
                },
                {
                    type: UNREGISTER_RESOURCE,
                    payload: 'comments',
                }
            ),
            {
                posts: {
                    data: {},
                    list: {
                        ids: [],
                        params: {
                            filter: {},
                            order: null,
                            page: 1,
                            perPage: null,
                            sort: null,
                        },
                        selectedIds: [],
                        total: 0,
                        loadedOnce: false,
                    },
                    props: { name: 'posts' },
                },
            }
        );
    });

    it('should call inner reducers for each resource when action has a resource meta', () => {
        assert.deepEqual(
            reducer(
                {
                    posts: {
                        data: {},
                        list: {
                            ids: [],
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            selectedIds: [],
                            total: 0,
                            loadedOnce: false,
                        },
                        props: { name: 'posts' },
                    },
                    comments: {
                        data: {},
                        list: {
                            ids: [],
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            selectedIds: [],
                            total: 0,
                            loadedOnce: false,
                        },
                        props: { name: 'comments' },
                    },
                },
                {
                    type: CRUD_CHANGE_LIST_PARAMS,
                    meta: { resource: 'posts' },
                    payload: {
                        filter: { commentable: true },
                        order: null,
                        page: 1,
                        perPage: null,
                        sort: null,
                    },
                }
            ),
            {
                posts: {
                    data: {},
                    list: {
                        ids: [],
                        params: {
                            filter: { commentable: true },
                            order: null,
                            page: 1,
                            perPage: null,
                            sort: null,
                        },
                        selectedIds: [],
                        total: 0,
                        loadedOnce: false,
                    },
                    props: { name: 'posts' },
                },
                comments: {
                    data: {},
                    list: {
                        ids: [],
                        params: {
                            filter: {},
                            order: null,
                            page: 1,
                            perPage: null,
                            sort: null,
                        },
                        selectedIds: [],
                        total: 0,
                        loadedOnce: false,
                    },
                    props: { name: 'comments' },
                },
            }
        );
    });

    describe('getReferenceResource selector', () => {
        it('should return the reference resource', () => {
            const state = {
                posts: 'POSTS',
                comments: 'COMMENTS',
            };
            const props = {
                reference: 'comments',
            };
            expect(getReferenceResource(state, props)).toEqual('COMMENTS');
        });
    });
});
