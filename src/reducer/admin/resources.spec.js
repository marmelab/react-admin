import assert from 'assert';
import { stub } from 'sinon';
import { initialState as data } from './resource/data';
import { initialState as list } from './resource/list/index.spec';
import reducer from './resources';
import { DECLARE_RESOURCES } from '../../actions';

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

        assert.deepEqual(
            reducer(
                { oldResource: {} },
                { type: DECLARE_RESOURCES, payload: resources }
            ),
            {
                posts: {
                    data,
                    list,
                    props: { name: 'posts', list: postsList },
                },
                comments: {
                    data,
                    list,
                    props: { name: 'comments', create: commentsCreate },
                },
                users: {
                    data,
                    list,
                    props: { name: 'users', edit: usersEdit },
                },
            }
        );
    });

    it('should call inner reducers for each resource when action has a resource meta', () => {
        const innerReducer = state => state;
        const resourceReducer = stub().callsFake(() => innerReducer);

        assert.deepEqual(
            reducer(
                {
                    posts: {
                        data,
                        list,
                        props: { name: 'posts' },
                    },
                    comments: {
                        data,
                        list,
                        props: { name: 'comments' },
                    },
                },
                { type: 'A_RESOURCE_ACTION', meta: { resource: 'posts' } },
                resourceReducer
            ),
            {
                posts: {
                    data,
                    list,
                    props: { name: 'posts' },
                },
                comments: {
                    data,
                    list,
                    props: { name: 'comments' },
                },
            }
        );

        assert(resourceReducer.calledWith({ name: 'posts' }));
        assert(resourceReducer.neverCalledWith({ name: 'comments' }));
    });
});
