import expect from 'expect';
import reducer, { getReferenceResource } from './index';
import { REGISTER_RESOURCE, UNREGISTER_RESOURCE } from '../../../actions';
import { CRUD_CHANGE_LIST_PARAMS } from '../../../actions/listActions';

describe('Resources Reducer', () => {
    it('should return previous state if the action has no resource meta and is not REGISTER_RESOURCE nor UNREGISTER_RESOURCE', () => {
        const previousState = { previous: true };
        expect(
            reducer(previousState, {
                type: 'OTHER_ACTION',
                meta: {},
            })
        ).toEqual(previousState);
    });

    it('should initialize a new resource upon REGISTER_RESOURCE', () => {
        expect(
            reducer(
                {
                    posts: {
                        data: {},
                        list: {
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            ids: [],
                            cachedRequests: {},
                            expanded: [],
                            total: null,
                            selectedIds: [],
                            loadedOnce: false,
                        },
                        validity: {},
                        props: { name: 'posts' },
                    },
                    comments: {
                        data: {},
                        list: {
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            ids: [],
                            cachedRequests: {},
                            expanded: [],
                            total: null,
                            selectedIds: [],
                            loadedOnce: false,
                        },
                        validity: {},
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
            )
        ).toEqual({
            posts: {
                data: {},
                list: {
                    params: {
                        filter: {},
                        order: null,
                        page: 1,
                        perPage: null,
                        sort: null,
                    },
                    ids: [],
                    cachedRequests: {},
                    expanded: [],
                    total: null,
                    selectedIds: [],
                    loadedOnce: false,
                },
                validity: {},
                props: { name: 'posts' },
            },
            comments: {
                data: {},
                list: {
                    params: {
                        filter: {},
                        order: null,
                        page: 1,
                        perPage: null,
                        sort: null,
                    },
                    ids: [],
                    cachedRequests: {},
                    expanded: [],
                    total: null,
                    selectedIds: [],
                    loadedOnce: false,
                },
                validity: {},
                props: { name: 'comments' },
            },
            users: {
                data: {},
                list: {
                    params: {
                        filter: {},
                        order: null,
                        page: 1,
                        perPage: null,
                        sort: null,
                    },
                    ids: [],
                    cachedRequests: {},
                    expanded: [],
                    total: null,
                    selectedIds: [],
                    loadedOnce: false,
                },
                validity: {},
                props: { name: 'users', options: 'foo' },
            },
        });
    });

    it('should remove a resource upon UNREGISTER_RESOURCE', () => {
        expect(
            reducer(
                {
                    posts: {
                        data: {},
                        list: {
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            ids: [],
                            cachedRequests: {},
                            expanded: [],
                            total: null,
                            selectedIds: [],
                            loadedOnce: false,
                        },
                        validity: {},
                        props: { name: 'posts' },
                    },
                    comments: {
                        data: {},
                        list: {
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            ids: [],
                            cachedRequests: {},
                            expanded: [],
                            total: null,
                            selectedIds: [],
                            loadedOnce: false,
                        },
                        validity: {},
                        props: { name: 'comments' },
                    },
                },
                {
                    type: UNREGISTER_RESOURCE,
                    payload: 'comments',
                }
            )
        ).toEqual({
            posts: {
                data: {},
                list: {
                    params: {
                        filter: {},
                        order: null,
                        page: 1,
                        perPage: null,
                        sort: null,
                    },
                    ids: [],
                    cachedRequests: {},
                    expanded: [],
                    total: null,
                    selectedIds: [],
                    loadedOnce: false,
                },
                validity: {},
                props: { name: 'posts' },
            },
        });
    });

    it('should call inner reducers for each resource when action has a resource meta', () => {
        expect(
            reducer(
                {
                    posts: {
                        data: {},
                        list: {
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            ids: [],
                            cachedRequests: {},
                            expanded: [],
                            total: null,
                            selectedIds: [],
                            loadedOnce: false,
                        },
                        validity: {},
                        props: { name: 'posts' },
                    },
                    comments: {
                        data: {},
                        list: {
                            params: {
                                filter: {},
                                order: null,
                                page: 1,
                                perPage: null,
                                sort: null,
                            },
                            ids: [],
                            cachedRequests: {},
                            expanded: [],
                            total: null,
                            selectedIds: [],
                            loadedOnce: false,
                        },
                        validity: {},
                        props: { name: 'comments' },
                    },
                },
                {
                    // @ts-ignore
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
            )
        ).toEqual({
            posts: {
                data: {},
                list: {
                    params: {
                        filter: { commentable: true },
                        order: null,
                        page: 1,
                        perPage: null,
                        sort: null,
                    },
                    ids: [],
                    cachedRequests: {},
                    expanded: [],
                    total: null,
                    selectedIds: [],
                    loadedOnce: false,
                },
                validity: {},
                props: { name: 'posts' },
            },
            comments: {
                data: {},
                list: {
                    params: {
                        filter: {},
                        order: null,
                        page: 1,
                        perPage: null,
                        sort: null,
                    },
                    ids: [],
                    cachedRequests: {},
                    expanded: [],
                    total: null,
                    selectedIds: [],
                    loadedOnce: false,
                },
                validity: {},
                props: { name: 'comments' },
            },
        });
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
