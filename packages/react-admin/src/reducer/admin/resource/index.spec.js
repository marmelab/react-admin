import assert from 'assert';
import reducer from './index';
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
        const dataReducer = () => () => 'data_data';
        const listReducer = () => () => 'list_data';

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
                dataReducer,
                listReducer
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
        const dataReducer = () => () => 'data_data';
        const listReducer = () => () => 'list_data';

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
                },
                dataReducer,
                listReducer
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
        const innerReducer = state => state;
        const dataReducer = jest.fn(() => innerReducer);
        const listReducer = jest.fn(() => innerReducer);

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
                { type: 'A_RESOURCE_ACTION', meta: { resource: 'posts' } },
                dataReducer,
                listReducer
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

        assert.equal(dataReducer.mock.calls[0][0], 'posts');
        assert.equal(listReducer.mock.calls[0][0], 'posts');
    });
});
