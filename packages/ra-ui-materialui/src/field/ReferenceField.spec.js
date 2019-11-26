import React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithRedux, DataProviderContext } from 'ra-core';

import ReferenceField, { ReferenceFieldView } from './ReferenceField';
import TextField from './TextField';

describe('<ReferenceField />', () => {
    afterEach(cleanup);

    describe('Progress bar', () => {
        it('should display a loader on mount if the reference is not in the store', () => {
            const { queryByRole, container } = renderWithRedux(
                <ReferenceField
                    record={{ postId: 123 }}
                    resource="comments"
                    source="postId"
                    reference="posts"
                    basePath="/comments"
                >
                    <TextField source="title" />
                </ReferenceField>
            );
            expect(queryByRole('progressbar')).not.toBeNull();
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(0);
        });

        it('should not display a loader on mount if the reference is in the store', () => {
            const { queryByRole, container } = renderWithRedux(
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
            expect(queryByRole('progressbar')).toBeNull();
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(1);
        });

        it('should not display a loader if the dataProvider query completes', async () => {
            const dataProvider = {
                getMany: jest.fn(() =>
                    Promise.resolve({ data: [{ id: 123, title: 'foo' }] })
                ),
            };
            const { queryByRole, container } = renderWithRedux(
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
                </DataProviderContext.Provider>,
                {
                    admin: {
                        resources: {
                            posts: { data: {} },
                        },
                    },
                }
            );
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(queryByRole('progressbar')).toBeNull();
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(1);
        });

        it('should not display a loader if the dataProvider query completes without finding the reference', async () => {
            const dataProvider = {
                getMany: jest.fn(() => Promise.resolve({ data: [] })),
            };
            const { queryByRole, container } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <ReferenceField
                        record={{ postId: 123 }}
                        resource="comments"
                        source="postId"
                        reference="posts"
                        basePath="/comments"
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </DataProviderContext.Provider>
            );
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(queryByRole('progressbar')).toBeNull();
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(0);
        });

        it('should not display a loader if the dataProvider query fails', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const dataProvider = {
                getMany: jest.fn(() => Promise.reject(new Error())),
            };
            const { queryByRole, container } = renderWithRedux(
                <DataProviderContext.Provider value={dataProvider}>
                    <ReferenceField
                        record={{ postId: 123 }}
                        resource="comments"
                        source="postId"
                        reference="posts"
                        basePath="/comments"
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </DataProviderContext.Provider>
            );
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(queryByRole('progressbar')).toBeNull();
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(0);
        });
    });

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
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 123, title: 'foo' }] })
            ),
        };
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
        await new Promise(resolve => setTimeout(resolve, 10));
        const action = dispatch.mock.calls[0][0];
        expect(action.type).toBe('RA/CRUD_GET_MANY');
        expect(action.payload).toEqual({ ids: [123] });
    });

    it('should display an error icon if the dataProvider call fails', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = {
            getMany: jest.fn(() => Promise.reject('boo')),
        };
        const { getByRole } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <ReferenceField
                    record={{ postId: 123 }}
                    resource="comments"
                    source="postId"
                    reference="posts"
                    basePath="/comments"
                >
                    <TextField source="title" />
                </ReferenceField>
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve, 10));
        const ErrorIcon = getByRole('presentation');
        expect(ErrorIcon).toBeDefined();
        expect(ErrorIcon.getAttribute('aria-errormessage')).toBe('boo');
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
