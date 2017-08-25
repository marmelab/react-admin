import assert from 'assert';
import { stub } from 'sinon';
import reducer from './index';
import { DECLARE_RESOURCES } from '../../../actions';

describe('Resources Reducer', () => {
    it('should return previous state if the action has no resource meta and is not DECLARE_RESOURCES', () => {
        const previousState = { previous: true };
        assert.deepEqual(
            reducer(previousState, { type: 'A_TYPE', meta: { foo: 'bar' } }),
            previousState
        );
    });

    it('should initialize resources upon DECLARE_RESOURCES', () => {
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

    it('should call inner reducers for each resource when action has a resource meta', () => {
        const innerReducer = state => state;
        const dataReducer = stub().callsFake(() => innerReducer);
        const listReducer = stub().callsFake(() => innerReducer);

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

        assert(dataReducer.calledWith('posts'));
        assert(listReducer.calledWith('posts'));
        assert(dataReducer.neverCalledWith('comments'));
        assert(listReducer.neverCalledWith('comments'));
    });
});
