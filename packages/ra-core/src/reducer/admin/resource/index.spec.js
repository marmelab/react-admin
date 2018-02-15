import assert from 'assert';
import reducer, { getReferenceResource } from './index';
import { combineReducers } from 'redux';
import props from './props';
import { REGISTER_RESOURCE, UNREGISTER_RESOURCE } from '../../../actions';

describe('Resources Reducer', () => {
    it('should return previous state if the action has no resource meta and is not REGISTER_RESOURCE nor UNREGISTER_RESOURCE', () => {
        const previousState = { previous: true };
        assert.deepEqual(
            reducer(previousState, { type: 'A_TYPE', meta: { foo: 'bar' } }),
            previousState
        );
    });

    it('should initialize a new resource upon REGISTER_RESOURCE', () => {
        const resourceReducer = combineReducers({
            props,
            data: () => 'data_data',
            list: () => 'list_data',
        });

        assert.deepEqual(
            reducer(
                {
                    posts: {
                        data: 'data_data',
                        list: 'list_data',
                        props: { name: 'posts' },
                    },
                    comments: {
                        data: 'data_data',
                        list: 'list_data',
                        props: { name: 'comments' },
                    },
                },
                {
                    type: REGISTER_RESOURCE,
                    payload: {
                        name: 'users',
                        options: 'foo',
                    },
                },
                resourceReducer
            ),
            {
                posts: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'posts' },
                },
                comments: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'comments' },
                },
                users: {
                    data: 'data_data',
                    list: 'list_data',
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
                        data: 'data_data',
                        list: 'list_data',
                        props: { name: 'posts' },
                    },
                    comments: {
                        data: 'data_data',
                        list: 'list_data',
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
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'posts' },
                },
            }
        );
    });

    it('should call inner reducers for each resource when action has a resource meta', () => {
        const innerReducer = (state = {}) => state;
        const combinedReducers = {
            props,
            data: jest.fn(innerReducer),
            list: jest.fn(innerReducer),
        };
        const resourceReducer = combineReducers(combinedReducers);

        const action = {
            type: 'A_RESOURCE_ACTION',
            meta: { resource: 'posts' },
        };
        assert.deepEqual(
            reducer(
                {
                    posts: {
                        data: 'data_data',
                        list: 'list_data',
                        props: { name: 'posts' },
                    },
                    comments: {
                        data: 'data_data',
                        list: 'list_data',
                        props: { name: 'comments' },
                    },
                },
                action,
                resourceReducer
            ),
            {
                posts: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'posts' },
                },
                comments: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'comments' },
                },
            }
        );

        expect(combinedReducers.data).lastCalledWith('data_data', action);
        expect(combinedReducers.list).lastCalledWith('list_data', action);
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
