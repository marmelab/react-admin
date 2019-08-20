import React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { renderWithRedux, DataProviderContext } from 'ra-core';

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

    it('should call the dataProvider for the related record', async () => {
        const dataProvider = jest.fn();
        dataProvider.mockImplementationOnce(() =>
            Promise.resolve({ data: [{ id: 123, title: 'foo' }] })
        );
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
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
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        const action = dispatch.mock.calls[0][0];
        expect(action.type).toBe('RA/CRUD_GET_MANY');
        expect(action.payload).toEqual({ ids: [123] });
    });
    describe('ReferenceFieldView', () => {
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
                        loaded={true}
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
                    loaded={true}
                >
                    <TextField source="title" />
                </ReferenceFieldView>
            );
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(0);
        });
    });
});
