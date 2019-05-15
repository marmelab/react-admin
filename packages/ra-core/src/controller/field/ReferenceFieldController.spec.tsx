import React from 'react';
import { render, cleanup } from 'react-testing-library';

import ReferenceFieldController from './ReferenceFieldController';
import renderWithRedux from '../../util/renderWithRedux';
import { crudGetManyAccumulate } from '../../actions';

const defaultState = {
    admin: {
        resources: { posts: { data: { 123: { id: 123, title: 'foo' } } } },
    },
};

describe('<ReferenceFieldController />', () => {
    afterEach(cleanup);
    it('should call crudGetManyAccumulate on componentDidMount if reference source is defined', () => {
        const { dispatch } = renderWithRedux(
            <ReferenceFieldController
                children={jest.fn().mockReturnValue(<span>children</span>)} // eslint-disable-line react/no-children-prop
                record={{ id: 1, postId: 123 }}
                source="postId"
                reference="posts"
                basePath=""
            />,
            defaultState
        );
        expect(dispatch).toBeCalledTimes(1);
        expect(dispatch).toBeCalledWith(crudGetManyAccumulate('posts', [123]));
    });

    it('should not call crudGetManyAccumulate on componentDidMount if reference source is null or undefined', () => {
        const { dispatch } = renderWithRedux(
            <ReferenceFieldController
                children={jest.fn().mockReturnValue(<span>children</span>)} // eslint-disable-line react/no-children-prop
                record={{ id: 1, postId: null }}
                source="postId"
                reference="posts"
                basePath=""
            />,
            defaultState
        );
        expect(dispatch).toBeCalledTimes(0);
    });

    it('should pass resourceLinkPath and referenceRecord to its children', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, postId: 123 }}
                source="postId"
                reference="posts"
                resource="comments"
                basePath="/comments"
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceFieldController>,
            defaultState
        );

        expect(children).toBeCalledWith({
            isLoading: false,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/posts/123',
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
            isLoading: false,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/prefix/posts/123',
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
            isLoading: false,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/edit/123',
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
                crudGetManyAccumulate={crudGetManyAccumulate}
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
            isLoading: false,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/show/123',
        });
    });

    it('should render a link to the Show page of the related record when the linkType is show', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, postId: 123 }}
                source="postId"
                resource="comments"
                reference="posts"
                basePath="/comments"
                linkType="show"
            >
                {children}
            </ReferenceFieldController>,
            defaultState
        );

        expect(children).toBeCalledWith({
            isLoading: false,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/posts/123/show',
        });
    });

    it('should accept edit as resource name when linkType is show', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                reference="edit"
                resource="show"
                basePath="/show"
                linkType="show"
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
            isLoading: false,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/edit/123/show',
        });
    });

    it('should accept show as resource name when linkType is show', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                reference="show"
                resource="edit"
                basePath="/edit"
                crudGetManyAccumulate={crudGetManyAccumulate}
                linkType="show"
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
            isLoading: false,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: '/show/123/show',
        });
    });

    it('should set resourceLinkPath to false when the linkType is false', () => {
        const children = jest.fn().mockReturnValue(<span>children</span>);
        renderWithRedux(
            <ReferenceFieldController
                record={{ id: 1, postId: 123 }}
                source="postId"
                reference="posts"
                basePath="/foo"
                linkType={false}
            >
                {children}
            </ReferenceFieldController>,
            defaultState
        );

        expect(children).toBeCalledWith({
            isLoading: false,
            referenceRecord: { id: 123, title: 'foo' },
            resourceLinkPath: false,
        });
    });
});
