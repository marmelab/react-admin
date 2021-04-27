import * as React from 'react';
import expect from 'expect';

import ReferenceFieldController from './ReferenceFieldController';
import { renderWithRedux } from 'ra-test';
import { DataProviderContext } from '../../dataProvider';

const defaultState = {
    admin: {
        resources: { posts: { data: { 123: { id: 123, title: 'foo' } } } },
    },
};

describe('<ReferenceFieldController />', () => {
    it('should call the CRUD_GET_MANY action on mount if reference source is defined', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 123, title: 'foo' }] })
            ),
        };
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ReferenceFieldController
                    children={jest.fn().mockReturnValue(<span>children</span>)} // eslint-disable-line react/no-children-prop
                    record={{ id: 1, postId: 123 }}
                    source="postId"
                    reference="posts"
                    resource="comments"
                    basePath=""
                />
            </DataProviderContext.Provider>,
            defaultState
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(5);
        const call = dispatch.mock.calls.find(
            params => params[0].type === 'RA/CRUD_GET_MANY'
        );
        expect(call).not.toBeUndefined();
        const crudGetManyAction = call[0];
        expect(crudGetManyAction.payload).toEqual({
            ids: [123],
        });
        expect(crudGetManyAction.meta.resource).toEqual('posts');
        expect(dataProvider.getMany).toBeCalledTimes(1);
        expect(dataProvider.getMany).toBeCalledWith('posts', {
            ids: [123],
        });
    });

    it('should not call CRUD_GET_MANY action on mount if reference source is null or undefined', async () => {
        const { dispatch } = renderWithRedux(
            <ReferenceFieldController
                children={jest.fn().mockReturnValue(<span>children</span>)} // eslint-disable-line react/no-children-prop
                record={{ id: 1, postId: null }}
                source="postId"
                reference="posts"
                resource="comments"
                basePath=""
            />,
            defaultState
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(0);
    });

    it('should pass resourceLinkPath and referenceRecord to its children', async () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, postId: 123 }}
                source="postId"
                reference="posts"
                resource="comments"
                basePath="/comments"
            >
                {children}
            </ReferenceFieldController>,
            defaultState
        );
        expect(children).toBeCalledWith({
            loading: true,
            loaded: true,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/posts/123',
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should accept slashes in resource name', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, postId: 123 }}
                source="postId"
                reference="prefix/posts"
                resource="prefix/comments"
                basePath="/prefix/comments"
            >
                {children}
            </ReferenceFieldController>,
            {
                admin: {
                    resources: {
                        'prefix/posts': {
                            data: { 123: { id: 123, title: 'foo' } },
                        },
                    },
                },
            }
        );

        expect(children).toBeCalledWith({
            loading: true,
            loaded: true,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/prefix/posts/123',
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should accept edit as resource name', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                reference="edit"
                resource="show"
                basePath="/show"
            >
                {children}
            </ReferenceFieldController>,
            {
                admin: {
                    resources: {
                        edit: {
                            data: { 123: { id: 123, title: 'foo' } },
                        },
                    },
                },
            }
        );

        expect(children).toBeCalledWith({
            loading: true,
            loaded: true,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/edit/123',
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should accept show as resource name', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                reference="show"
                resource="edit"
                basePath="/edit"
            >
                {children}
            </ReferenceFieldController>,
            {
                admin: {
                    resources: {
                        show: {
                            data: { 123: { id: 123, title: 'foo' } },
                        },
                    },
                },
            }
        );

        expect(children).toBeCalledWith({
            loading: true,
            loaded: true,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/show/123',
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should render a link to the Show page of the related record when the link is show', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, postId: 123 }}
                source="postId"
                resource="comments"
                reference="posts"
                basePath="/comments"
                link="show"
            >
                {children}
            </ReferenceFieldController>,
            defaultState
        );

        expect(children).toBeCalledWith({
            loading: true,
            loaded: true,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/posts/123/show',
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should accept edit as resource name when link is show', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                reference="edit"
                resource="show"
                basePath="/show"
                link="show"
            >
                {children}
            </ReferenceFieldController>,
            {
                admin: {
                    resources: {
                        edit: {
                            data: { 123: { id: 123, title: 'foo' } },
                        },
                    },
                },
            }
        );

        expect(children).toBeCalledWith({
            loading: true,
            loaded: true,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/edit/123/show',
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should accept show as resource name when link is show', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                reference="show"
                resource="edit"
                basePath="/edit"
                link="show"
            >
                {children}
            </ReferenceFieldController>,
            {
                admin: {
                    resources: {
                        show: {
                            data: { 123: { id: 123, title: 'foo' } },
                        },
                    },
                },
            }
        );

        expect(children).toBeCalledWith({
            loading: true,
            loaded: true,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/show/123/show',
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should set resourceLinkPath to false when the link is false', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, postId: 123 }}
                source="postId"
                reference="posts"
                resource="comments"
                basePath="/foo"
                link={false}
            >
                {children}
            </ReferenceFieldController>,
            defaultState
        );

        expect(children).toBeCalledWith({
            loading: true,
            loaded: true,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: false,
            error: null,
            refetch: expect.any(Function),
        });
    });
});
