import React from 'react';
import assert from 'assert';
import { render } from 'react-testing-library';

import ReferenceManyFieldController from './ReferenceManyFieldController';
import renderWithRedux from '../../util/renderWithRedux';

describe('<ReferenceManyFieldController />', () => {
    it('should set loadedOnce to false when related records are not yet fetched', () => {
        const children = jest.fn().mockReturnValue('children');
        const { dispatch } = renderWithRedux(
            <ReferenceManyFieldController
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
            >
                {children}
            </ReferenceManyFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                1: { id: 1, title: 'hello' },
                                2: { id: 2, title: 'world' },
                            },
                        },
                    },
                    references: {
                        oneToMany: {
                            'foo_bar@fooId_barId': {
                                ids: [1, 2],
                            },
                        },
                    },
                },
            }
        );
        assert.deepEqual(dispatch.mock.calls[0], [
            {
                meta: {
                    fetch: 'GET_MANY_REFERENCE',
                    onFailure: {
                        notification: {
                            body: 'ra.notification.http_error',
                            level: 'warning',
                        },
                    },
                    relatedTo: 'foo_bar@foo_id_undefined',
                    resource: 'bar',
                },
                payload: {
                    filter: {},
                    id: undefined,
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'DESC' },
                    source: undefined,
                    target: 'foo_id',
                },
                type: 'RA/CRUD_GET_MANY_REFERENCE',
            },
        ]);
    });

    it('should pass data and ids to children function', () => {
        const children = jest.fn().mockReturnValue('children');
        const data = {
            1: { id: 1, title: 'hello' },
            2: { id: 2, title: 'world' },
        };
        renderWithRedux(
            <ReferenceManyFieldController
                resource="foo"
                reference="bar"
                target="fooId"
                basePath=""
                record={{
                    source: 'barId',
                }}
                source="source"
            >
                {children}
            </ReferenceManyFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                1: { id: 1, title: 'hello' },
                                2: { id: 2, title: 'world' },
                            },
                        },
                    },
                    references: {
                        oneToMany: {
                            'foo_bar@fooId_barId': {
                                ids: [1, 2],
                            },
                        },
                    },
                },
            }
        );
        assert.deepEqual(children.mock.calls[0][0].data, data);
        assert.deepEqual(children.mock.calls[0][0].ids, [1, 2]);
    });

    it('should support record with string identifier', () => {
        const children = jest.fn().mockReturnValue('children');
        renderWithRedux(
            <ReferenceManyFieldController
                resource="foo"
                reference="bar"
                target="fooId"
                basePath=""
                record={{
                    source: 'barId',
                }}
                source="source"
            >
                {children}
            </ReferenceManyFieldController>,
            {
                admin: {
                    resources: {
                        bar: {
                            data: {
                                'abc-1': { id: 'abc-1', title: 'hello' },
                                'abc-2': { id: 'abc-2', title: 'world' },
                            },
                        },
                    },
                    references: {
                        oneToMany: {
                            'foo_bar@fooId_barId': {
                                ids: ['abc-1', 'abc-2'],
                            },
                        },
                    },
                },
            }
        );
        assert.deepEqual(children.mock.calls[0][0].data, {
            'abc-1': { id: 'abc-1', title: 'hello' },
            'abc-2': { id: 'abc-2', title: 'world' },
        });
        assert.deepEqual(children.mock.calls[0][0].ids, ['abc-1', 'abc-2']);
    });

    it('should support custom source', () => {
        const children = jest.fn().mockReturnValue('children');

        const { dispatch } = renderWithRedux(
            <ReferenceManyFieldController
                resource="posts"
                reference="comments"
                target="post_id"
                basePath=""
                record={{ id: 'not me', customId: 1 }}
                source="customId"
            >
                {children}
            </ReferenceManyFieldController>
        );

        assert.deepEqual(dispatch.mock.calls[0], [
            {
                meta: {
                    fetch: 'GET_MANY_REFERENCE',
                    onFailure: {
                        notification: {
                            body: 'ra.notification.http_error',
                            level: 'warning',
                        },
                    },
                    relatedTo: 'posts_comments@post_id_1',
                    resource: 'comments',
                },
                payload: {
                    filter: {},
                    id: 1,
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'DESC' },
                    source: 'customId',
                    target: 'post_id',
                },
                type: 'RA/CRUD_GET_MANY_REFERENCE',
            },
        ]);
    });

    it('should call crudGetManyReference when its props changes', () => {
        const ControllerWrapper = props => (
            <ReferenceManyFieldController
                record={{ id: 1 }}
                resource="foo"
                reference="bar"
                target="foo_id"
                basePath=""
                source="id"
                {...props}
            >
                {() => 'null'}
            </ReferenceManyFieldController>
        );

        const { rerender, dispatch } = renderWithRedux(<ControllerWrapper />);
        rerender(<ControllerWrapper sort={{ field: 'id', order: 'ASC' }} />);

        expect(dispatch).toBeCalledTimes(2);

        assert.deepEqual(dispatch.mock.calls[0], [
            {
                meta: {
                    fetch: 'GET_MANY_REFERENCE',
                    onFailure: {
                        notification: {
                            body: 'ra.notification.http_error',
                            level: 'warning',
                        },
                    },
                    relatedTo: 'foo_bar@foo_id_1',
                    resource: 'bar',
                },
                payload: {
                    filter: {},
                    id: 1,
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'DESC' },
                    source: 'id',
                    target: 'foo_id',
                },
                type: 'RA/CRUD_GET_MANY_REFERENCE',
            },
        ]);

        assert.deepEqual(dispatch.mock.calls[1], [
            {
                meta: {
                    fetch: 'GET_MANY_REFERENCE',
                    onFailure: {
                        notification: {
                            body: 'ra.notification.http_error',
                            level: 'warning',
                        },
                    },
                    relatedTo: 'foo_bar@foo_id_1',
                    resource: 'bar',
                },
                payload: {
                    filter: {},
                    id: 1,
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'ASC' },
                    source: 'id',
                    target: 'foo_id',
                },
                type: 'RA/CRUD_GET_MANY_REFERENCE',
            },
        ]);
    });
});
