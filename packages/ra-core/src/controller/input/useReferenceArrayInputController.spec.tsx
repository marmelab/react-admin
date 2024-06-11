import * as React from 'react';
import { ReactElement } from 'react';
import expect from 'expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import {
    useReferenceArrayInputController,
    UseReferenceArrayInputParams,
} from './useReferenceArrayInputController';
import { CoreAdminContext } from '../../core';
import { testDataProvider } from '../../dataProvider';
import { ChoicesContextValue, Form } from '../../form';
import { SORT_ASC } from '../list/queryReducer';

const ReferenceArrayInputController = (
    props: UseReferenceArrayInputParams & {
        children: (params: ChoicesContextValue) => ReactElement;
    }
) => {
    const { children, ...rest } = props;
    return children(useReferenceArrayInputController(rest)) as ReactElement;
};

describe('useReferenceArrayInputController', () => {
    const defaultProps = {
        field: { value: undefined },
        record: undefined,
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
    };

    afterEach(async () => {
        // wait for the getManyAggregate batch to resolve
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
    });

    describe('isLoading', () => {
        it('should set isLoading to true as long as there are no references fetched and no selected references', () => {
            const children = jest.fn(({ isLoading }) => (
                <div>{isLoading.toString()}</div>
            ));
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getMany: jest.fn().mockResolvedValue({ data: [] }),
                        getList: jest
                            .fn()
                            .mockResolvedValue({ data: [], total: 0 }),
                    })}
                >
                    <Form
                        defaultValues={{ tag_ids: [1, 2] }}
                        onSubmit={jest.fn()}
                    >
                        <ReferenceArrayInputController {...defaultProps}>
                            {children}
                        </ReferenceArrayInputController>
                    </Form>
                </CoreAdminContext>
            );
            expect(screen.queryByText('true')).not.toBeNull();
        });

        it('should set isLoading to false once the dataProvider returns', async () => {
            const children = jest.fn(({ isLoading }) => (
                <div>{isLoading.toString()}</div>
            ));
            const dataProvider = testDataProvider({
                getMany: jest.fn().mockResolvedValue({ data: [] }),
                getList: jest.fn().mockResolvedValue({ data: [], total: 0 }),
            });
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form
                        onSubmit={jest.fn()}
                        defaultValues={{ tag_ids: [1, 2] }}
                    >
                        <ReferenceArrayInputController {...defaultProps}>
                            {children}
                        </ReferenceArrayInputController>
                    </Form>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(dataProvider.getList).toHaveBeenCalledTimes(1);
            });
            await waitFor(() => {
                expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            });
            expect(screen.queryByText('false')).not.toBeNull();
        });
    });

    describe('error', () => {
        it('should set error in case of references fetch error and there are no selected reference in the input value', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const children = jest.fn(({ error }) => (
                <div>{error?.message}</div>
            ));
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.reject(new Error('boom')),
                        getMany: () => Promise.resolve({ data: [] }),
                    })}
                >
                    <Form onSubmit={jest.fn()}>
                        <ReferenceArrayInputController {...defaultProps}>
                            {children}
                        </ReferenceArrayInputController>
                    </Form>
                </CoreAdminContext>
            );

            await waitFor(() => {
                expect(screen.getByText('boom')).not.toBeNull();
            });
        });

        it('should set error in case of references fetch error and there are no data found for the references already selected', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const children = jest.fn(({ error }) => (
                <div>{error?.message}</div>
            ));
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.reject(new Error('boom')),
                        getMany: () => Promise.resolve({ data: [] }),
                    })}
                >
                    <Form onSubmit={jest.fn()}>
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [1] }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    </Form>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(screen.queryByText('boom')).not.toBeNull();
            });
        });

        it.skip('should not display an error in case of references fetch error but data from at least one selected reference was found', async () => {
            const children = jest.fn(({ error }) => (
                <div>{error?.message}</div>
            ));
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.reject(new Error('boom')),
                        // @ts-ignore
                        getMany: () =>
                            Promise.resolve({
                                data: [{ id: 1, title: 'foo' }],
                            }),
                    })}
                >
                    <Form onSubmit={jest.fn()}>
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [1, 2] }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    </Form>
                </CoreAdminContext>
            );
            await waitFor(
                () => new Promise(resolve => setTimeout(resolve, 100))
            );
            expect(screen.queryByText('boom')).toBeNull();
        });
    });

    it('should call getList on mount with default params', async () => {
        const children = jest.fn(() => <div />);
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={jest.fn()}>
                    <ReferenceArrayInputController {...defaultProps}>
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );
        expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
            pagination: {
                page: 1,
                perPage: 25,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {},
            meta: undefined,
            signal: undefined,
        });
    });

    it('should call getList with meta when provided', async () => {
        const children = jest.fn(() => <div />);
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={jest.fn()}>
                    <ReferenceArrayInputController
                        {...defaultProps}
                        queryOptions={{ meta: { value: 'a' } }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );
        expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
            pagination: {
                page: 1,
                perPage: 25,
            },
            sort: {
                field: 'id',
                order: 'DESC',
            },
            filter: {},
            meta: { value: 'a' },
            signal: undefined,
        });
    });

    it('should allow to customize getList arguments with perPage, sort, and filter props', () => {
        const children = jest.fn(() => <div />);
        const dataProvider = testDataProvider({
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={jest.fn()}>
                    <ReferenceArrayInputController
                        {...defaultProps}
                        sort={{ field: 'foo', order: 'ASC' }}
                        page={2}
                        perPage={5}
                        filter={{ permanentFilter: 'foo' }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );
        expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
            pagination: {
                page: 2,
                perPage: 5,
            },
            sort: {
                field: 'foo',
                order: 'ASC',
            },
            filter: { permanentFilter: 'foo' },
            meta: undefined,
            signal: undefined,
        });
    });

    it('should call getList when setFilters is called', async () => {
        const children = jest.fn(({ setFilters }) => (
            <button
                aria-label="Filter"
                onClick={() => setFilters({ q: 'bar' })}
            />
        ));
        const dataProvider = testDataProvider({
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={jest.fn()}>
                    <ReferenceArrayInputController {...defaultProps}>
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByLabelText('Filter'));
        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 1,
                    perPage: 25,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: { q: 'bar' },
                signal: undefined,
            });
        });
    });

    it('should call getMany on mount if value is set', async () => {
        const children = jest.fn(() => <div />);
        const dataProvider = testDataProvider({
            // @ts-ignore
            getMany: jest
                .fn()
                .mockResolvedValue(
                    Promise.resolve({ data: [{ id: 5 }, { id: 6 }] })
                ),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={jest.fn()} defaultValues={{ tag_ids: [5, 6] }}>
                    <ReferenceArrayInputController {...defaultProps}>
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledWith('tags', {
                ids: [5, 6],
                signal: undefined,
            });
        });
    });

    it('should call getMany with meta when provided', async () => {
        const children = jest.fn(() => <div />);
        const dataProvider = testDataProvider({
            // @ts-ignore
            getMany: jest
                .fn()
                .mockResolvedValue(
                    Promise.resolve({ data: [{ id: 5 }, { id: 6 }] })
                ),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={jest.fn()} defaultValues={{ tag_ids: [5, 6] }}>
                    <ReferenceArrayInputController
                        {...defaultProps}
                        queryOptions={{ meta: { value: 'a' } }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledWith('tags', {
                ids: [5, 6],
                meta: { value: 'a' },
                signal: undefined,
            });
        });
    });

    it('should not call getMany when calling setFilters', async () => {
        const children = jest.fn(({ setFilters }) => (
            <button
                aria-label="Filter"
                onClick={() => setFilters({ q: 'bar' })}
            />
        ));
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
            // @ts-ignore
            getMany: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [{ id: 5 }] })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={jest.fn()} defaultValues={{ tag_ids: [5] }}>
                    <ReferenceArrayInputController {...defaultProps}>
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByLabelText('Filter'));

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
    });

    it('should not call getMany when props other than input are changed from outside', async () => {
        const record = { tag_ids: [5] };
        const onSubmit = jest.fn();
        const children = jest.fn(() => <div />);
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
            // @ts-ignore
            getMany: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [{ id: 5 }] })),
        });
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={onSubmit} record={record}>
                    <ReferenceArrayInputController {...defaultProps}>
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );

        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={onSubmit} record={record}>
                    <ReferenceArrayInputController
                        {...defaultProps}
                        filter={{ permanentFilter: 'bar' }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });

        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form record={record} onSubmit={onSubmit}>
                    <ReferenceArrayInputController
                        {...defaultProps}
                        filter={{ permanentFilter: 'bar' }}
                        sort={{ field: 'foo', order: 'ASC' }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(3);
        });
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });

        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form record={record} onSubmit={onSubmit}>
                    <ReferenceArrayInputController
                        {...defaultProps}
                        filter={{ permanentFilter: 'bar' }}
                        sort={{ field: 'foo', order: 'ASC' }}
                        perPage={42}
                    >
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(4);
        });
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
    });

    it('should call getMany when input value changes', async () => {
        const children = jest.fn(() => <div />);
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
            getMany: jest.fn().mockResolvedValue({ data: [] }),
        });
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form record={{ tag_ids: [5] }} onSubmit={jest.fn()}>
                    <ReferenceArrayInputController {...defaultProps}>
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledWith('tags', {
                ids: [5],
                signal: undefined,
            });
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form record={{ tag_ids: [5, 6] }} onSubmit={jest.fn()}>
                    <ReferenceArrayInputController {...defaultProps}>
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledWith('tags', {
                ids: [5, 6],
                signal: undefined,
            });
        });
    });

    it('should have props compatible with the ListContext', async () => {
        const children = ({
            setPage,
            setPerPage,
            setSort,
        }): React.ReactElement => {
            const handleSetPage = () => {
                setPage(2);
            };
            const handleSetPerPage = () => {
                setPerPage(50);
            };
            const handleSetSort = () => {
                setSort({ field: 'name', order: SORT_ASC });
            };

            return (
                <>
                    <button aria-label="setPage" onClick={handleSetPage} />
                    <button
                        aria-label="setPerPage"
                        onClick={handleSetPerPage}
                    />
                    <button aria-label="setSort" onClick={handleSetSort} />
                </>
            );
        };

        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={jest.fn()}>
                    <ReferenceArrayInputController
                        {...defaultProps}
                        field={{ value: [5, 6] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByLabelText('setPage'));
        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 2,
                    perPage: 25,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: {},
                meta: undefined,
                signal: undefined,
            });
        });

        fireEvent.click(screen.getByLabelText('setPerPage'));
        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 1,
                    perPage: 50,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: {},
                meta: undefined,
                signal: undefined,
            });
        });

        fireEvent.click(screen.getByLabelText('setSort'));
        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 1,
                    perPage: 50,
                },
                sort: {
                    field: 'name',
                    order: 'ASC',
                },
                filter: {},
                meta: undefined,
                signal: undefined,
            });
        });
    });

    it('should call its children with the correct resource', () => {
        const children = jest.fn(() => null);
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()}>
                    <ReferenceArrayInputController
                        {...defaultProps}
                        field={{ value: [1, 2] }}
                    >
                        {children}
                    </ReferenceArrayInputController>
                </Form>
            </CoreAdminContext>
        );
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({ resource: 'tags' })
        );
    });

    describe('enableGetChoices', () => {
        it('should not fetch possible values using getList on load but only when enableGetChoices returns true', async () => {
            const children = jest.fn().mockReturnValue(<div />);
            const enableGetChoices = jest.fn().mockImplementation(({ q }) => {
                return q ? q.length > 2 : false;
            });
            const dataProvider = testDataProvider({
                getList: jest
                    .fn()
                    .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
            });
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form onSubmit={jest.fn()}>
                        <ReferenceArrayInputController
                            {...defaultProps}
                            enableGetChoices={enableGetChoices}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    </Form>
                </CoreAdminContext>
            );

            // not call on start
            await waitFor(() => {
                expect(dataProvider.getList).not.toHaveBeenCalled();
            });
            expect(enableGetChoices).toHaveBeenCalledWith({});

            const { setFilters } = children.mock.calls[0][0];
            setFilters({ q: 'hello world' });

            await waitFor(() => {
                expect(dataProvider.getList).toHaveBeenCalledTimes(1);
            });
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 1,
                    perPage: 25,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: { q: 'hello world' },
                signal: undefined,
            });
            expect(enableGetChoices).toHaveBeenCalledWith({ q: 'hello world' });
        });

        it('should fetch current value using getMany even if enableGetChoices is returning false', async () => {
            const children = jest.fn(() => <div />);
            const dataProvider = testDataProvider({
                // @ts-ignore
                getList: jest
                    .fn()
                    .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
                // @ts-ignore
                getMany: jest
                    .fn()
                    .mockResolvedValue({ data: [{ id: 5 }, { id: 6 }] }),
            });
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form onSubmit={jest.fn()} record={{ tag_ids: [5, 6] }}>
                        <ReferenceArrayInputController
                            {...defaultProps}
                            enableGetChoices={() => false}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    </Form>
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(dataProvider.getMany).toHaveBeenCalledWith('tags', {
                    ids: [5, 6],
                    signal: undefined,
                });
            });
        });

        it('should set isLoading to false if enableGetChoices returns false', async () => {
            const children = jest.fn().mockReturnValue(<div />);
            await new Promise(resolve => setTimeout(resolve, 100)); // empty the query deduplication in useQueryWithStore
            const enableGetChoices = jest.fn().mockImplementation(() => false);
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={jest.fn()}>
                        <ReferenceArrayInputController
                            {...defaultProps}
                            enableGetChoices={enableGetChoices}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    </Form>
                </CoreAdminContext>
            );

            await waitFor(() => {
                expect(children).toHaveBeenCalledWith(
                    expect.objectContaining({ isLoading: false })
                );
            });
        });
    });
});
