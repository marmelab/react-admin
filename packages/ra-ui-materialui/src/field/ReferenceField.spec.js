import React from 'react';
import expect from 'expect';
import { render, cleanup } from 'react-testing-library';
import { MemoryRouter } from 'react-router';
import { renderWithRedux } from 'ra-core';

import ReferenceField, { ReferenceFieldView } from './ReferenceField';
import TextField from './TextField';

describe('<ReferenceField />', () => {
    afterEach(cleanup);

    it('should use the reference from the store if available', () => {
        const { container, getByText } = renderWithRedux(
            <MemoryRouter>
                <ReferenceField
                    record={{ postId: 123 }}
                    resource="comments"
                    source="postId"
                    reference="posts"
                    basePath="/comments"
                >
                    <TextField source="title" />
                </ReferenceField>
            </MemoryRouter>,
            {
                admin: {
                    resources: {
                        posts: {
                            data: { 123: { id: 123, title: 'hello' } },
                        },
                    },
                },
            }
        );
        expect(getByText('hello')).toBeDefined();
        const links = container.getElementsByTagName('a');
        expect(links).toHaveLength(1);
        expect(links.item(0).href).toBe('http://localhost/posts/123');
    });

    it('should call the dataProvider for the related record', () => {
        const { dispatch } = renderWithRedux(
            <MemoryRouter>
                <ReferenceField
                    record={{ postId: 123 }}
                    resource="comments"
                    source="postId"
                    reference="posts"
                    basePath="/comments"
                >
                    <TextField source="title" />
                </ReferenceField>
            </MemoryRouter>
        );
        const action = dispatch.mock.calls[0][0];
        expect(action.type).toBe('RA/CRUD_GET_MANY_ACCUMULATE');
        expect(action.payload).toEqual({ ids: [123], resource: 'posts' });
    });

    it('should render a link to specified resourceLinkPath', () => {
        const { container } = render(
            <MemoryRouter>
                <ReferenceFieldView
                    record={{ postId: 123 }}
                    source="postId"
                    referenceRecord={{ id: 123, title: 'foo' }}
                    reference="posts"
                    resource="comments"
                    resourceLinkPath="/posts/123"
                    basePath="/comments"
                >
                    <TextField source="title" />
                </ReferenceFieldView>
            </MemoryRouter>
        );
        const links = container.getElementsByTagName('a');
        expect(links).toHaveLength(1);
        expect(links.item(0).href).toBe('http://localhost/posts/123');
    });

    it('should render no link when resourceLinkPath is not specified', () => {
        const { container } = render(
            <ReferenceFieldView
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath="/foo"
                resourceLinkPath={false}
            >
                <TextField source="title" />
            </ReferenceFieldView>
        );
        const links = container.getElementsByTagName('a');
        expect(links).toHaveLength(0);
    });
});
