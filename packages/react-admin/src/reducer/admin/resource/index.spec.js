import assert from 'assert';
import reducer from './index';
import { DECLARE_RESOURCES } from '../../../actions';

describe('Resources Reducer', () => {
    test('should return previous state if the action has no resource meta and is not DECLARE_RESOURCES', () => {
        const previousState = { previous: true };
        assert.deepEqual(
            reducer(previousState, { type: 'A_TYPE', meta: { foo: 'bar' } }),
            previousState
        );
    });

    test('should initialize resources upon DECLARE_RESOURCES', () => {
        const postsList = () => {};
        const commentsCreate = () => {};
        const usersEdit = () => {};
        const resources = [
            { name: 'posts', list: postsList },
            { name: 'comments', create: commentsCreate },
            { name: 'users', edit: usersEdit },
        ];

        const dataReducer = () => () => 'data_data';
        const listReducer = () => () => 'list_data';

        assert.deepEqual(
            reducer(
                { oldResource: {} },
                { type: DECLARE_RESOURCES, payload: resources },
                dataReducer,
                listReducer
            ),
            {
                posts: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'posts', list: postsList },
                },
                comments: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'comments', create: commentsCreate },
                },
                users: {
                    data: 'data_data',
                    list: 'list_data',
                    props: { name: 'users', edit: usersEdit },
                },
            }
        );
    });

    test('should call inner reducers for each resource when action has a resource meta', () => {
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
