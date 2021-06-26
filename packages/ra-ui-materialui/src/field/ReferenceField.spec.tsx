import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DataProviderContext, RecordContextProvider } from 'ra-core';
import { renderWithRedux } from 'ra-test';

import ReferenceField, { ReferenceFieldView } from './ReferenceField';
import TextField from './TextField';

describe('<ReferenceField />', () => {
    const record = { id: 123, postId: 123 };

    describe('Progress bar', () => {
        it("should not display a loader on mount if the reference is not in the store and a second hasn't passed yet", async () => {
            const { queryByRole, container } = renderWithRedux(
                <ReferenceFieldView
                    record={record}
                    resource="comments"
                    source="postId"
                    reference="posts"
                    basePath="/comments"
                    loaded={false}
                    loading={true}
                >
                    <TextField source="title" />
                </ReferenceFieldView>
            );
            await new Promise(resolve => setTimeout(resolve, 500));
            expect(queryByRole('progressbar')).toBeNull();
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(0);
        });

        it('should display a loader on mount if the reference is not in the store and a second has passed', async () => {
            const { queryByRole, container } = renderWithRedux(
                <ReferenceFieldView
                    record={record}
                    resource="comments"
                    source="postId"
                    reference="posts"
                    basePath="/comments"
                    loaded={false}
                    loading={true}
                >
                    <TextField source="title" />
                </ReferenceFieldView>
            );
            await new Promise(resolve => setTimeout(resolve, 1001));
            expect(queryByRole('progressbar')).not.toBeNull();
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(0);
        });

        it('should not display a loader on mount if the reference is in the store', () => {
            const { queryByRole, container } = renderWithRedux(
                <MemoryRouter>
                    <ReferenceField
                        record={record}
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
                // @ts-ignore-line
                <DataProviderContext.Provider value={dataProvider}>
                    <MemoryRouter>
                        <ReferenceField
                            record={record}
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
                // @ts-ignore-line
                <DataProviderContext.Provider value={dataProvider}>
                    <ReferenceField
                        record={record}
                        resource="comments"
                        source="postId"
                        reference="posts"
                        basePath="/comments"
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </DataProviderContext.Provider>,
                { admin: { resources: { posts: { data: {} } } } }
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
                // @ts-ignore-line
                <DataProviderContext.Provider value={dataProvider}>
                    <ReferenceField
                        record={record}
                        resource="comments"
                        source="postId"
                        reference="posts"
                        basePath="/comments"
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </DataProviderContext.Provider>,
                { admin: { resources: { posts: { data: {} } } } }
            );
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(queryByRole('progressbar')).toBeNull();
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(0);
        });
    });

    it('should display the emptyText if the field is empty', () => {
        const { getByText } = renderWithRedux(
            <ReferenceField
                record={{ id: 123 }}
                resource="comments"
                source="postId"
                reference="posts"
                basePath="/comments"
                emptyText="EMPTY"
            >
                <TextField source="title" />
            </ReferenceField>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        expect(getByText('EMPTY')).not.toBeNull();
    });

    it('should use the reference from the store if available', () => {
        const { container, getByText } = renderWithRedux(
            <MemoryRouter>
                <ReferenceField
                    record={record}
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
        expect(getByText('hello')).not.toBeNull();
        const links = container.getElementsByTagName('a');
        expect(links).toHaveLength(1);
        expect(links.item(0).href).toBe('http://localhost/posts/123');
    });

    it('should use record from RecordContext', () => {
        const { container, getByText } = renderWithRedux(
            <MemoryRouter>
                <RecordContextProvider value={record}>
                    <ReferenceField
                        resource="comments"
                        source="postId"
                        reference="posts"
                        basePath="/comments"
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </RecordContextProvider>
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
        expect(getByText('hello')).not.toBeNull();
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
            // @ts-ignore-line
            <DataProviderContext.Provider value={dataProvider}>
                <MemoryRouter>
                    <ReferenceField
                        record={record}
                        resource="comments"
                        source="postId"
                        reference="posts"
                        basePath="/comments"
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </MemoryRouter>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await waitFor(() => {
            const action = dispatch.mock.calls[0][0];
            expect(action.type).toBe('RA/CRUD_GET_MANY');
            expect(action.payload).toEqual({ ids: [123] });
        });
    });

    it('should display an error icon if the dataProvider call fails', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = {
            getMany: jest.fn(() => Promise.reject('boo')),
        };
        const { queryByRole } = renderWithRedux(
            // @ts-ignore-line
            <DataProviderContext.Provider value={dataProvider}>
                <ReferenceField
                    record={record}
                    resource="comments"
                    source="postId"
                    reference="posts"
                    basePath="/comments"
                >
                    <TextField source="title" />
                </ReferenceField>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );
        await waitFor(() => {
            const ErrorIcon = queryByRole('presentation', { hidden: true });
            expect(ErrorIcon).not.toBeNull();
            expect(ErrorIcon.getAttribute('aria-errormessage')).toBe('boo');
        });
    });

    it('should throw an error if used without a Resource for the reference', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        class ErrorBoundary extends React.Component<
            {
                onError?: (
                    error: Error,
                    info: { componentStack: string }
                ) => void;
            },
            { error: Error | null }
        > {
            constructor(props) {
                super(props);
                this.state = { error: null };
            }

            static getDerivedStateFromError(error) {
                // Update state so the next render will show the fallback UI.
                return { error };
            }

            componentDidCatch(error, errorInfo) {
                // You can also log the error to an error reporting service
                this.props.onError(error, errorInfo);
            }

            render() {
                if (this.state.error) {
                    // You can render any custom fallback UI
                    return <h1>Something went wrong.</h1>;
                }

                return this.props.children;
            }
        }
        const onError = jest.fn();
        renderWithRedux(
            <ErrorBoundary onError={onError}>
                <ReferenceField
                    record={{ id: 123 }}
                    resource="comments"
                    source="postId"
                    reference="posts"
                    basePath="/comments"
                >
                    <TextField source="title" />
                </ReferenceField>
            </ErrorBoundary>,
            { admin: { resources: { comments: { data: {} } } } }
        );
        await waitFor(() => {
            expect(onError.mock.calls[0][0].message).toBe(
                'You must declare a <Resource name="posts"> in order to use a <ReferenceField reference="posts">'
            );
        });
    });

    describe('ReferenceFieldView', () => {
        it('should render a link to specified resourceLinkPath', () => {
            const { container } = render(
                <MemoryRouter>
                    <ReferenceFieldView
                        record={record}
                        source="postId"
                        referenceRecord={{ id: 123, title: 'foo' }}
                        reference="posts"
                        resource="comments"
                        resourceLinkPath="/posts/123"
                        basePath="/comments"
                        loaded={true}
                        loading={false}
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
                    record={record}
                    source="fooId"
                    referenceRecord={{ id: 123, title: 'foo' }}
                    reference="bar"
                    basePath="/foo"
                    resourceLinkPath={false}
                    loaded={true}
                    loading={false}
                >
                    <TextField source="title" />
                </ReferenceFieldView>
            );
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(0);
        });

        it('should work without basePath', () => {
            const { container } = render(
                <MemoryRouter>
                    <ReferenceFieldView
                        record={record}
                        source="postId"
                        referenceRecord={{ id: 123, title: 'foo' }}
                        reference="posts"
                        resource="comments"
                        resourceLinkPath="/posts/123"
                        loaded={true}
                        loading={false}
                    >
                        <TextField source="title" />
                    </ReferenceFieldView>
                </MemoryRouter>
            );
            const links = container.getElementsByTagName('a');
            expect(links).toHaveLength(1);
            expect(links.item(0).href).toBe('http://localhost/posts/123');
        });
    });
});
