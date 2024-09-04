import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';

import { testDataProvider } from '../../dataProvider/testDataProvider';
import { CoreAdminContext } from '../../core';
import { useReferenceManyFieldController } from './useReferenceManyFieldController';
import { memoryStore } from '../../store';

const ReferenceManyFieldController = props => {
    const { children, page = 1, perPage = 25, ...rest } = props;
    const controllerProps = useReferenceManyFieldController({
        page,
        perPage,
        ...rest,
    });
    return children(controllerProps);
};

describe('useReferenceManyFieldController', () => {
    it('should set isLoading to true when related records are not yet fetched', async () => {
        const ComponentToTest = ({ isLoading }: { isLoading?: boolean }) => {
            return <div>isLoading: {isLoading?.toString()}</div>;
        };
        const dataProvider = testDataProvider({
            getManyReference: () => Promise.resolve({ data: [], total: 0 }),
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceManyFieldController
                    resource="foo"
                    source="items"
                    reference="bar"
                    target="foo_id"
                    record={{ id: 1, items: [1, 2] }}
                >
                    {props => <ComponentToTest {...props} />}
                </ReferenceManyFieldController>
            </CoreAdminContext>
        );

        expect(screen.queryByText('isLoading: true')).not.toBeNull();
        await waitFor(() => {
            expect(screen.queryByText('isLoading: false')).not.toBeNull();
        });
    });

    it('should set isLoading to false when related records have been fetched and there are results', async () => {
        const ComponentToTest = ({ isLoading }: { isLoading?: boolean }) => {
            return <div>isLoading: {isLoading?.toString()}</div>;
        };
        const dataProvider = testDataProvider({
            getManyReference: () =>
                Promise.resolve({
                    data: [
                        { id: 1, title: 'hello' },
                        { id: 2, title: 'world' },
                    ],
                    total: 2,
                }) as any,
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceManyFieldController
                    resource="foo"
                    source="items"
                    reference="bar"
                    target="foo_id"
                    record={{ id: 1, items: [1, 2] }}
                >
                    {props => <ComponentToTest {...props} />}
                </ReferenceManyFieldController>
            </CoreAdminContext>
        );

        expect(screen.queryByText('isLoading: true')).not.toBeNull();
        await waitFor(() => {
            expect(screen.queryByText('isLoading: false')).not.toBeNull();
        });
    });

    it('should call dataProvider.getManyReferences on mount', async () => {
        const dataProvider = testDataProvider({
            getManyReference: jest
                .fn()
                .mockResolvedValue({ data: [], total: 0 }),
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceManyFieldController
                    resource="authors"
                    source="id"
                    record={{ id: 123, name: 'James Joyce' }}
                    reference="books"
                    target="author_id"
                >
                    {() => 'null'}
                </ReferenceManyFieldController>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getManyReference).toHaveBeenCalledWith(
                'books',
                {
                    id: 123,
                    target: 'author_id',
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'DESC' },
                    filter: {},
                    signal: undefined,
                }
            );
        });
    });

    it('should pass data to children function', async () => {
        const children = jest.fn().mockReturnValue('children');
        const dataProvider = testDataProvider({
            getManyReference: () =>
                Promise.resolve({
                    data: [
                        { id: 1, title: 'hello' },
                        { id: 2, title: 'world' },
                    ],
                    total: 2,
                }) as any,
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceManyFieldController
                    resource="authors"
                    source="id"
                    record={{ id: 123, name: 'James Joyce' }}
                    reference="books"
                    target="author_id"
                >
                    {children}
                </ReferenceManyFieldController>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(children).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: [
                        { id: 1, title: 'hello' },
                        { id: 2, title: 'world' },
                    ],
                    total: 2,
                    hasPreviousPage: false,
                    hasNextPage: false,
                })
            );
        });
    });

    it('should handle partial pagination', async () => {
        const children = jest.fn().mockReturnValue('children');
        const dataProvider = testDataProvider({
            getManyReference: () =>
                Promise.resolve({
                    data: [
                        { id: 1, title: 'hello' },
                        { id: 2, title: 'world' },
                    ],
                    pageInfo: {
                        hasPreviousPage: false,
                        hasNextPage: false,
                    },
                }) as any,
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceManyFieldController
                    resource="authors"
                    source="id"
                    record={{ id: 123, name: 'James Joyce' }}
                    reference="books"
                    target="author_id"
                >
                    {children}
                </ReferenceManyFieldController>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(children).toHaveBeenCalledWith(
                expect.objectContaining({
                    total: undefined,
                    hasPreviousPage: false,
                    hasNextPage: false,
                })
            );
        });
    });

    it('should support custom source', async () => {
        const dataProvider = testDataProvider({
            getManyReference: jest
                .fn()
                .mockResolvedValue({ data: [], total: 0 }),
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceManyFieldController
                    resource="authors"
                    source="uniqueName"
                    record={{
                        id: 123,
                        uniqueName: 'jamesjoyce256',
                        name: 'James Joyce',
                    }}
                    reference="books"
                    target="author_id"
                >
                    {() => 'null'}
                </ReferenceManyFieldController>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getManyReference).toHaveBeenCalledWith(
                'books',
                {
                    id: 'jamesjoyce256',
                    target: 'author_id',
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'DESC' },
                    filter: {},
                    signal: undefined,
                }
            );
        });
    });

    it('should call crudGetManyReference when its props changes', async () => {
        const dataProvider = testDataProvider({
            getManyReference: jest
                .fn()
                .mockResolvedValue({ data: [], total: 0 }),
        });
        const ControllerWrapper = props => (
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceManyFieldController
                    resource="authors"
                    source="id"
                    record={{ id: 123, name: 'James Joyce' }}
                    sort={props.sort}
                    reference="books"
                    target="author_id"
                >
                    {() => 'null'}
                </ReferenceManyFieldController>
            </CoreAdminContext>
        );

        const { rerender } = render(<ControllerWrapper />);
        expect(dataProvider.getManyReference).toBeCalledTimes(1);
        rerender(<ControllerWrapper sort={{ field: 'id', order: 'ASC' }} />);
        await waitFor(() => {
            expect(dataProvider.getManyReference).toBeCalledTimes(2);
            expect(dataProvider.getManyReference).toHaveBeenCalledWith(
                'books',
                {
                    id: 123,
                    target: 'author_id',
                    pagination: { page: 1, perPage: 25 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                    signal: undefined,
                }
            );
        });
    });

    it('should take only last change in case of a burst of setFilters calls (case of inputs being currently edited)', async () => {
        let childFunction = ({ setFilters, filterValues }) => (
            <input
                aria-label="search"
                type="text"
                value={filterValues.q || ''}
                onChange={event => {
                    setFilters({ q: event.target.value }, undefined, true);
                }}
            />
        );
        const dataProvider = testDataProvider({
            getManyReference: jest
                .fn()
                .mockResolvedValue({ data: [], total: 0 }),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceManyFieldController
                    resource="authors"
                    source="id"
                    record={{ id: 123, name: 'James Joyce' }}
                    reference="books"
                    target="author_id"
                >
                    {childFunction}
                </ReferenceManyFieldController>
            </CoreAdminContext>
        );
        const searchInput = screen.getByLabelText('search');

        fireEvent.change(searchInput, { target: { value: 'hel' } });
        fireEvent.change(searchInput, { target: { value: 'hell' } });
        fireEvent.change(searchInput, { target: { value: 'hello' } });

        await waitFor(() => new Promise(resolve => setTimeout(resolve, 600)));

        // Called twice: on load and on filter changes
        expect(dataProvider.getManyReference).toHaveBeenCalledTimes(2);
        expect(dataProvider.getManyReference).toHaveBeenCalledWith('books', {
            target: 'author_id',
            id: 123,
            filter: { q: 'hello' },
            pagination: { page: 1, perPage: 25 },
            sort: { field: 'id', order: 'DESC' },
            meta: undefined,
            signal: undefined,
        });
    });

    it('should support custom storeKey', async () => {
        const store = memoryStore();
        const setStore = jest.spyOn(store, 'setItem');

        render(
            <CoreAdminContext store={store}>
                <ReferenceManyFieldController
                    resource="authors"
                    source="uniqueName"
                    record={{
                        id: 123,
                        uniqueName: 'jamesjoyce256',
                        name: 'James Joyce',
                    }}
                    reference="books"
                    target="author_id"
                    storeKey="customKey"
                >
                    {({ onToggleItem }) => {
                        return (
                            <button onClick={() => onToggleItem(123)}>
                                Toggle
                            </button>
                        );
                    }}
                </ReferenceManyFieldController>
            </CoreAdminContext>
        );

        fireEvent.click(await screen.findByText('Toggle'));
        await waitFor(() => {
            expect(setStore).toHaveBeenCalledWith('customKey.selectedIds', [
                123,
            ]);
        });
    });

    describe('response metadata', () => {
        it('should return response metadata as meta', async () => {
            const dataProvider = testDataProvider({
                getManyReference: () =>
                    Promise.resolve({
                        data: [
                            { id: 1, title: 'hello' },
                            { id: 2, title: 'world' },
                        ],
                        total: 2,
                        meta: {
                            facets: [
                                { foo: 'bar', count: 1 },
                                { foo: 'baz', count: 2 },
                            ],
                        },
                    }) as any,
            });

            const ListMetadataInspector = () => {
                const listContext = useReferenceManyFieldController({
                    resource: 'authors',
                    source: 'id',
                    record: { id: 123, name: 'James Joyce' },
                    reference: 'books',
                    target: 'author_id',
                });

                return (
                    <>
                        Response metadata:{' '}
                        <pre>{JSON.stringify(listContext.meta, null)}</pre>
                    </>
                );
            };

            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <ListMetadataInspector />
                </CoreAdminContext>
            );

            await screen.findByText(
                '{"facets":[{"foo":"bar","count":1},{"foo":"baz","count":2}]}'
            );
        });
    });
});
