import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    RecordContextProvider,
    CoreAdminContext,
    testDataProvider,
    useGetMany,
    ResourceDefinitionContextProvider,
    AuthProvider,
} from 'ra-core';
import { QueryClient } from '@tanstack/react-query';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ReferenceField } from './ReferenceField';
import {
    Children,
    LinkShow,
    LinkDefaultEditView,
    LinkDefaultShowView,
    LinkMissingView,
    LinkFalse,
    MissingReferenceIdEmptyTextTranslation,
    MissingReferenceEmptyText,
    SXLink,
    SXNoLink,
    SlowAccessControl,
} from './ReferenceField.stories';
import { TextField } from './TextField';

const theme = createTheme({});

describe('<ReferenceField />', () => {
    const record = { id: 123, postId: 123 };

    describe('Progress bar', () => {
        it("should not display a loader on mount if the reference is not in the store and a second hasn't passed yet", async () => {
            const dataProvider = testDataProvider({
                getMany: jest.fn().mockImplementation(
                    () =>
                        new Promise(resolve =>
                            setTimeout(
                                () =>
                                    resolve({
                                        data: [{ id: 123, title: 'foo' }],
                                    }),
                                1500
                            )
                        )
                ),
            });
            render(
                <ThemeProvider theme={theme}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <ResourceDefinitionContextProvider
                            definitions={{
                                posts: {
                                    name: 'posts',
                                    hasEdit: true,
                                },
                            }}
                        >
                            <ReferenceField
                                record={record}
                                resource="comments"
                                source="postId"
                                reference="posts"
                            >
                                <TextField source="title" />
                            </ReferenceField>
                        </ResourceDefinitionContextProvider>
                    </CoreAdminContext>
                </ThemeProvider>
            );
            await new Promise(resolve => setTimeout(resolve, 500));
            expect(screen.queryByRole('progressbar')).toBeNull();
            expect(screen.queryAllByRole('link')).toHaveLength(0);
        });

        it('should display a loader on mount if the reference is not in the store and a second has passed', async () => {
            const dataProvider = testDataProvider({
                getMany: jest.fn().mockImplementation(
                    () =>
                        new Promise(resolve =>
                            setTimeout(
                                () =>
                                    resolve({
                                        data: [{ id: 123, title: 'foo' }],
                                    }),
                                1500
                            )
                        )
                ),
            });
            render(
                <ThemeProvider theme={theme}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <ResourceDefinitionContextProvider
                            definitions={{
                                posts: {
                                    name: 'posts',
                                    hasEdit: true,
                                },
                            }}
                        >
                            <ReferenceField
                                record={record}
                                resource="comments"
                                source="postId"
                                reference="posts"
                            >
                                <TextField source="title" />
                            </ReferenceField>
                        </ResourceDefinitionContextProvider>
                    </CoreAdminContext>
                </ThemeProvider>
            );
            await new Promise(resolve => setTimeout(resolve, 1001));
            await screen.findByRole('progressbar');
            expect(screen.queryAllByRole('link')).toHaveLength(0);
        });

        it('should not display a loader on mount if the reference was already fetched', async () => {
            const dataProvider = testDataProvider({
                getMany: jest.fn().mockResolvedValue({
                    data: [{ id: 123, title: 'foo' }],
                }),
            });
            // we need to keep the same query client between rerenders
            const queryClient = new QueryClient();
            const FecthGetMany = () => {
                useGetMany('posts', { ids: [123] });
                return <span>dummy</span>;
            };
            const { rerender } = render(
                <CoreAdminContext
                    dataProvider={dataProvider}
                    queryClient={queryClient}
                >
                    <FecthGetMany />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            });
            const slowDataProvider = testDataProvider({
                getMany: jest.fn().mockImplementation(
                    () =>
                        new Promise(resolve =>
                            setTimeout(
                                () =>
                                    resolve({
                                        data: [{ id: 123, title: 'foo' }],
                                    }),
                                1500
                            )
                        )
                ),
            });
            rerender(
                <ThemeProvider theme={theme}>
                    <CoreAdminContext
                        dataProvider={slowDataProvider}
                        queryClient={queryClient}
                    >
                        <ResourceDefinitionContextProvider
                            definitions={{
                                posts: {
                                    name: 'posts',
                                    hasEdit: true,
                                },
                            }}
                        >
                            <ReferenceField
                                record={record}
                                resource="comments"
                                source="postId"
                                reference="posts"
                            >
                                <TextField source="title" />
                            </ReferenceField>
                        </ResourceDefinitionContextProvider>
                    </CoreAdminContext>
                </ThemeProvider>
            );
            await new Promise(resolve => setTimeout(resolve, 500));
            expect(screen.queryByRole('progressbar')).toBeNull();
            expect(screen.queryAllByRole('link')).toHaveLength(1);
        });

        it('should not display a loader after the dataProvider query completes', async () => {
            const dataProvider = testDataProvider({
                getMany: jest.fn().mockResolvedValue({
                    data: [{ id: 123, title: 'foo' }],
                }),
            });
            render(
                <ThemeProvider theme={theme}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <ResourceDefinitionContextProvider
                            definitions={{
                                posts: {
                                    name: 'posts',
                                    hasEdit: true,
                                },
                            }}
                        >
                            <ReferenceField
                                record={record}
                                resource="comments"
                                source="postId"
                                reference="posts"
                            >
                                <TextField source="title" />
                            </ReferenceField>
                        </ResourceDefinitionContextProvider>
                    </CoreAdminContext>
                </ThemeProvider>
            );
            await waitFor(() =>
                expect(dataProvider.getMany).toHaveBeenCalledTimes(1)
            );
            expect(screen.queryByRole('progressbar')).toBeNull();
            expect(await screen.findAllByRole('link')).toHaveLength(1);
        });

        it('should not display a loader if the dataProvider query completes without finding the reference', async () => {
            const dataProvider = testDataProvider({
                getMany: jest.fn().mockResolvedValue({
                    data: [],
                }),
            });
            render(
                <ThemeProvider theme={theme}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <ResourceDefinitionContextProvider
                            definitions={{
                                posts: {
                                    name: 'posts',
                                    hasEdit: true,
                                },
                            }}
                        >
                            <ReferenceField
                                record={record}
                                resource="comments"
                                source="postId"
                                reference="posts"
                            >
                                <TextField source="title" />
                            </ReferenceField>
                        </ResourceDefinitionContextProvider>
                    </CoreAdminContext>
                </ThemeProvider>
            );
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(screen.queryByRole('progressbar')).toBeNull();
            expect(screen.queryAllByRole('link')).toHaveLength(0);
        });

        it('should not display a loader if the dataProvider query fails', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const dataProvider = testDataProvider({
                getMany: jest.fn().mockRejectedValue(new Error()),
            });
            render(
                <ThemeProvider theme={theme}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <ResourceDefinitionContextProvider
                            definitions={{
                                posts: {
                                    name: 'posts',
                                    hasEdit: true,
                                },
                            }}
                        >
                            <ReferenceField
                                record={record}
                                resource="comments"
                                source="postId"
                                reference="posts"
                            >
                                <TextField source="title" />
                            </ReferenceField>
                        </ResourceDefinitionContextProvider>
                    </CoreAdminContext>
                </ThemeProvider>
            );
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(screen.queryByRole('progressbar')).toBeNull();
            expect(screen.queryAllByRole('link')).toHaveLength(0);
        });
    });

    it('should display the emptyText if the field is empty', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <ReferenceField
                        record={{ id: 123 }}
                        resource="comments"
                        // @ts-expect-error source prop does not have a valid value
                        source="postId"
                        reference="posts"
                        emptyText="EMPTY"
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </CoreAdminContext>
            </ThemeProvider>
        );
        expect(screen.getByText('EMPTY')).not.toBeNull();
    });

    it('should display the emptyText if there is no reference', async () => {
        render(<MissingReferenceEmptyText />);
        await screen.findByText('no detail');
    });

    it('should use record from RecordContext', async () => {
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockResolvedValue({
                data: [{ id: 123, title: 'foo' }],
            }),
        });
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: {
                                name: 'posts',
                                hasEdit: true,
                            },
                        }}
                    >
                        <RecordContextProvider value={record}>
                            <ReferenceField
                                resource="comments"
                                source="postId"
                                reference="posts"
                            />
                        </RecordContextProvider>
                    </ResourceDefinitionContextProvider>
                </CoreAdminContext>
            </ThemeProvider>
        );
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(screen.queryByRole('progressbar')).toBeNull();
        expect(screen.getByText('foo')).not.toBeNull();
        expect(screen.queryAllByRole('link')).toHaveLength(1);
        expect(screen.queryByRole('link')?.getAttribute('href')).toBe(
            '#/posts/123'
        );
    });

    it('should use recordRepresentation to render the related record', async () => {
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockResolvedValue({
                data: [{ id: 123, title: 'foo' }],
            }),
        });
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: {
                                name: 'posts',
                                recordRepresentation: 'title',
                                hasEdit: true,
                            },
                        }}
                    >
                        <RecordContextProvider value={record}>
                            <ReferenceField
                                resource="comments"
                                source="postId"
                                reference="posts"
                            />
                        </RecordContextProvider>
                    </ResourceDefinitionContextProvider>
                </CoreAdminContext>
            </ThemeProvider>
        );
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(screen.queryByRole('progressbar')).toBeNull();
        await screen.findByText('foo');
        expect(screen.queryAllByRole('link')).toHaveLength(1);
        expect(screen.queryByRole('link')?.getAttribute('href')).toBe(
            '#/posts/123'
        );
    });

    it('should render its child component when given', async () => {
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockResolvedValue({
                data: [{ id: 123, title: 'foo' }],
            }),
        });
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: {
                                name: 'posts',
                                hasEdit: true,
                            },
                        }}
                    >
                        <RecordContextProvider value={record}>
                            <ReferenceField
                                resource="comments"
                                source="postId"
                                reference="posts"
                            >
                                <TextField source="title" />
                            </ReferenceField>
                        </RecordContextProvider>
                    </ResourceDefinitionContextProvider>
                </CoreAdminContext>
            </ThemeProvider>
        );
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(screen.queryByRole('progressbar')).toBeNull();
        expect(screen.getByText('foo')).not.toBeNull();
        expect(screen.queryAllByRole('link')).toHaveLength(1);
        expect(screen.queryByRole('link')?.getAttribute('href')).toBe(
            '#/posts/123'
        );
    });

    it('should call the dataProvider for the related record', async () => {
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockResolvedValue({
                data: [{ id: 123, title: 'foo' }],
            }),
        });
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <ReferenceField
                        record={record}
                        resource="comments"
                        source="postId"
                        reference="posts"
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </CoreAdminContext>
            </ThemeProvider>
        );
        await waitFor(() =>
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1)
        );
        expect(screen.getByText('foo')).not.toBeNull();
    });

    it('should display an error icon if the dataProvider call fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockRejectedValue(new Error('boo')),
        });
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <ReferenceField
                        record={record}
                        resource="comments"
                        source="postId"
                        reference="posts"
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </CoreAdminContext>
            </ThemeProvider>
        );
        await new Promise(resolve => setTimeout(resolve, 10));
        const ErrorIcon = screen.queryByRole('presentation', {
            hidden: true,
        });
        expect(ErrorIcon).not.toBeNull();
        expect(ErrorIcon?.getAttribute('aria-errormessage')).toBe('boo');
    });

    describe('link', () => {
        it('should render a link to specified link type', async () => {
            render(<LinkShow />);
            expect(await screen.findAllByRole('link')).toHaveLength(1);
            const referenceField = await screen.findByText('9780393966473');
            expect(referenceField?.parentElement?.getAttribute('href')).toBe(
                '/book_details/1/show'
            );
        });

        it('should link to edit by default if there is an edit view', async () => {
            render(<LinkDefaultEditView />);
            expect(await screen.findAllByRole('link')).toHaveLength(1);
            const referenceField = await screen.findByText('9780393966473');
            expect(referenceField?.parentElement?.getAttribute('href')).toBe(
                '/book_details/1'
            );
        });

        it('should link to edit by default if there is no edit view but a show view', async () => {
            render(<LinkDefaultShowView />);
            expect(await screen.findAllByRole('link')).toHaveLength(1);
            const referenceField = await screen.findByText('9780393966473');
            expect(referenceField?.parentElement?.getAttribute('href')).toBe(
                '/book_details/1/show'
            );
        });

        it('should render a link even though link view does not exist', async () => {
            render(<LinkMissingView />);
            expect(await screen.findAllByRole('link')).toHaveLength(1);
            const referenceField = await screen.findByText('9780393966473');
            expect(referenceField?.parentElement?.getAttribute('href')).toBe(
                '/book_details/1/show'
            );
        });

        it('should render no link when link is false', async () => {
            render(<LinkFalse />);
            await screen.findByText('9780393966473');
            expect(screen.queryAllByRole('link')).toHaveLength(0);
        });

        it('should call the link function with the referenced record', async () => {
            const dataProvider = testDataProvider({
                getMany: jest.fn().mockResolvedValue({
                    data: [{ id: 123, title: 'foo' }],
                }),
            });
            const link = jest.fn().mockReturnValue('/posts/123');

            render(
                <ThemeProvider theme={theme}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <ResourceDefinitionContextProvider
                            definitions={{
                                posts: {
                                    name: 'posts',
                                    hasEdit: true,
                                },
                            }}
                        >
                            <ReferenceField
                                record={record}
                                resource="comments"
                                source="postId"
                                reference="posts"
                                link={link}
                            >
                                <TextField source="title" />
                            </ReferenceField>
                        </ResourceDefinitionContextProvider>
                    </CoreAdminContext>
                </ThemeProvider>
            );
            await waitFor(() =>
                expect(dataProvider.getMany).toHaveBeenCalledTimes(1)
            );
            await waitFor(() =>
                expect(screen.queryByRole('link')?.getAttribute('href')).toBe(
                    '#/posts/123'
                )
            );

            expect(link).toHaveBeenCalledWith(
                { id: 123, title: 'foo' },
                'posts'
            );
        });
    });

    it('should accept multiple children', async () => {
        render(<Children />);
        expect(await screen.findByText('9780393966473')).not.toBeNull();
        expect(await screen.findByText('novel')).not.toBeNull();
    });

    it('should translate emptyText', async () => {
        render(<MissingReferenceIdEmptyTextTranslation />);

        expect(await screen.findByText('Not found')).not.toBeNull();
    });

    it('should accept a queryOptions prop', async () => {
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockResolvedValue({
                data: [{ id: 123, title: 'foo' }],
            }),
        });
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <ReferenceField
                        record={record}
                        resource="comments"
                        source="postId"
                        reference="posts"
                        queryOptions={{ meta: { foo: 'bar' } }}
                    >
                        <TextField source="title" />
                    </ReferenceField>
                </CoreAdminContext>
            </ThemeProvider>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: [123],
                meta: { foo: 'bar' },
                signal: undefined,
            });
        });
    });

    describe('Security', () => {
        it('should render a link to the show view when users have access to it for the referenced resource', async () => {
            const authProvider: AuthProvider = {
                login: () => Promise.reject(new Error('Not implemented')),
                logout: () => Promise.reject(new Error('Not implemented')),
                checkAuth: () => Promise.resolve(),
                checkError: () => Promise.reject(new Error('Not implemented')),
                getPermissions: () => Promise.resolve(undefined),
                canAccess: ({ action }) =>
                    Promise.resolve(action === 'list' || action === 'show'),
            };
            render(
                <SlowAccessControl
                    authProvider={authProvider}
                    allowedAction="show"
                />
            );
            fireEvent.click(
                await screen.findByText('Lewis Carroll', {
                    selector: 'a > span',
                })
            );
            await screen.findByText('ra.page.show');
            await screen.findByText('Carroll');
        });
        it('should render a link to the edit view when users have access to it for the referenced resource', async () => {
            const authProvider: AuthProvider = {
                login: () => Promise.reject(new Error('Not implemented')),
                logout: () => Promise.reject(new Error('Not implemented')),
                checkAuth: () => Promise.resolve(),
                checkError: () => Promise.reject(new Error('Not implemented')),
                getPermissions: () => Promise.resolve(undefined),
                canAccess: ({ action }) =>
                    Promise.resolve(action === 'list' || action === 'edit'),
            };
            render(
                <SlowAccessControl
                    authProvider={authProvider}
                    allowedAction="edit"
                />
            );
            fireEvent.click(
                await screen.findByText('Lewis Carroll', {
                    selector: 'a > span',
                })
            );
            await screen.findByText('ra.page.edit');
            await screen.findByDisplayValue('Carroll');
        });
        it('should not render a link when users do not have access to show nor edit for the referenced resource', async () => {
            const authProvider: AuthProvider = {
                login: () => Promise.reject(new Error('Not implemented')),
                logout: () => Promise.reject(new Error('Not implemented')),
                checkAuth: () => Promise.resolve(),
                checkError: () => Promise.reject(new Error('Not implemented')),
                getPermissions: () => Promise.resolve(undefined),
                canAccess: ({ action }) => Promise.resolve(action === 'list'),
            };
            render(<SlowAccessControl authProvider={authProvider} />);
            // Wait a tick for the canAccess calls to resolve
            await new Promise(resolve => setTimeout(resolve, 10));
            await screen.findByText('Lewis Carroll', {
                selector: '.RaReferenceField-root span',
            });
        });
    });
    describe('sx', () => {
        it('should override the default styles', async () => {
            render(<SXNoLink />);
            const elt = await screen.findByText('9780393966473');
            const root = elt.parentNode as HTMLElement;
            expect(
                getComputedStyle(root).getPropertyValue('background-color')
            ).toBe('red');
        });
        it('should override the default styles when using link', async () => {
            render(<SXLink />);
            await screen.findByRole('link');
            const elt = await screen.findByText('9780393966473');
            const root = elt.parentNode!.parentNode as HTMLElement;
            expect(
                getComputedStyle(root).getPropertyValue('background-color')
            ).toBe('red');
        });
    });
});
