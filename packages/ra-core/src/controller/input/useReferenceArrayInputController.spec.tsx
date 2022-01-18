import * as React from 'react';
import { ReactElement } from 'react';
import expect from 'expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { useReferenceArrayInputController } from './useReferenceArrayInputController';
import { CoreAdminContext } from '../../core';
import { testDataProvider } from '../../dataProvider';
import { FormWithRedirect } from '../../form';
import { SORT_ASC } from '../list/queryReducer';

const ReferenceArrayInputController = props => {
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
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                field={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
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
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                field={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
                expect(dataProvider.getList).toHaveBeenCalledTimes(1);
            });
            expect(screen.queryByText('false')).not.toBeNull();
        });
    });

    describe('error', () => {
        it('should set error in case of references fetch error and there are no selected reference in the input value', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const children = jest.fn(({ error }) => <div>{error}</div>);
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.reject(new Error('boom')),
                        getMany: () => Promise.resolve({ data: [] }),
                    })}
                >
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController {...defaultProps}>
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            );

            await waitFor(() => {
                expect(
                    screen.getByText('ra.input.references.all_missing')
                ).not.toBeNull();
            });
        });

        it('should set error in case of references fetch error and there are no data found for the references already selected', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const children = jest.fn(({ error }) => <div>{error}</div>);
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.reject(new Error('boom')),
                        getMany: () => Promise.resolve({ data: [] }),
                    })}
                >
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                field={{ value: [1] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(
                    screen.queryByText('ra.input.references.all_missing')
                ).not.toBeNull();
            });
        });

        it.skip('should not display an error in case of references fetch error but data from at least one selected reference was found', async () => {
            const children = jest.fn(({ error }) => <div>{error}</div>);
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.reject(new Error('boom')),
                        getMany: () =>
                            // @ts-ignore
                            Promise.resolve({
                                data: [{ id: 1, title: 'foo' }],
                            }),
                    })}
                >
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                field={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            );
            await waitFor(
                () => new Promise(resolve => setTimeout(resolve, 100))
            );
            expect(
                screen.queryByText('ra.input.references.all_missing')
            ).toBeNull();
        });
    });

    describe('warning', () => {
        it('should set warning if references fetch fails but selected references are not empty', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const children = jest.fn(({ warning }) => <div>{warning}</div>);
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.reject(new Error('boom')),
                        getMany: () =>
                            // @ts-ignore
                            Promise.resolve({
                                data: [{ id: 1, name: 'foo ' }],
                            }),
                    })}
                >
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                field={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(
                    screen.queryByText('ra.input.references.many_missing')
                ).not.toBeNull();
            });
        });

        it('should set warning if references were found but selected references are not complete', async () => {
            const children = jest.fn(({ warning }) => <div>{warning}</div>);
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () =>
                            // @ts-ignore
                            Promise.resolve({
                                data: [{ id: 1, name: 'foo' }],
                                total: 1,
                            }),
                        getMany: () => Promise.resolve({ data: [] }),
                    })}
                >
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                field={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(
                    screen.queryByText('ra.input.references.many_missing')
                ).not.toBeNull();
            });
        });

        it('should set warning if references were found but selected references are empty', async () => {
            const children = jest.fn(({ warning }) => <div>{warning}</div>);
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () =>
                            // @ts-ignore
                            Promise.resolve({
                                data: [],
                                total: 0,
                            }),
                        getMany: () =>
                            // @ts-ignore
                            Promise.resolve({ data: [{ id: 5 }, { id: 6 }] }),
                    })}
                >
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                field={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(
                    screen.queryByText('ra.input.references.many_missing')
                ).not.toBeNull();
            });
        });

        it('should not set warning if all references were found', async () => {
            const children = jest.fn(({ warning }) => <div>{warning}</div>);
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider({
                        getList: () => Promise.resolve({ data: [], total: 0 }),
                        getMany: () =>
                            // @ts-ignore
                            Promise.resolve({ data: [{ id: 1 }, { id: 2 }] }),
                    })}
                >
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                field={{ value: [1, 2] }}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(
                    screen.queryByText('ra.input.references.many_missing')
                ).toBeNull();
            });
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
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            allowEmpty
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
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
            filter: { q: '' },
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
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            sort={{ field: 'foo', order: 'ASC' }}
                            perPage={5}
                            filter={{ permanentFilter: 'foo' }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );
        expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
            pagination: {
                page: 1,
                perPage: 5,
            },
            sort: {
                field: 'foo',
                order: 'ASC',
            },
            filter: { permanentFilter: 'foo', q: '' },
        });
    });

    it('should call getList when setFilter is called', async () => {
        const children = jest.fn(({ setFilter }) => (
            <button aria-label="Filter" onClick={() => setFilter('bar')} />
        ));
        const dataProvider = testDataProvider({
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController {...defaultProps}>
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
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
            });
        });
    });

    it('should use custom filterToQuery function prop', async () => {
        const children = jest.fn(({ setFilter }) => (
            <button aria-label="Filter" onClick={() => setFilter('bar')} />
        ));

        const dataProvider = testDataProvider({
            getList: jest
                .fn()
                .mockResolvedValue(Promise.resolve({ data: [], total: 0 })),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            filterToQuery={searchText => ({
                                foo: searchText,
                            })}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
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
                filter: { foo: 'bar' },
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
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [5, 6] }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledWith('tags', {
                ids: [5, 6],
            });
        });
    });

    it('should not call getMany when calling setFilter', async () => {
        const children = jest.fn(({ setFilter }) => (
            <button aria-label="Filter" onClick={() => setFilter('bar')} />
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
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [5] }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByLabelText('Filter'));

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(2);
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
    });

    it('should not call getMany when props other than input are changed from outside', async () => {
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
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [5] }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );

        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [5] }}
                            filter={{ permanentFilter: 'bar' }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(2);
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });

        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [5] }}
                            filter={{ permanentFilter: 'bar' }}
                            sort={{ field: 'foo', order: 'ASC' }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(3);
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });

        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [5] }}
                            filter={{ permanentFilter: 'bar' }}
                            sort={{ field: 'foo', order: 'ASC' }}
                            perPage={42}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledTimes(4);
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
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [5] }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledWith('tags', {
                ids: [5],
            });
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [5, 6] }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledWith('tags', {
                ids: [5, 6],
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
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [5, 6] }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
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
                filter: { q: '' },
            });
        });

        fireEvent.click(screen.getByLabelText('setPerPage'));
        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('tags', {
                pagination: {
                    page: 2,
                    perPage: 50,
                },
                sort: {
                    field: 'id',
                    order: 'DESC',
                },
                filter: { q: '' },
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
                filter: { q: '' },
            });
        });
    });

    it('should call its children with the correct resource', () => {
        const children = jest.fn(() => null);
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    render={() => (
                        <ReferenceArrayInputController
                            {...defaultProps}
                            field={{ value: [1, 2] }}
                        >
                            {children}
                        </ReferenceArrayInputController>
                    )}
                />
            </CoreAdminContext>
        );
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({ resource: 'posts' })
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
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                allowEmpty
                                enableGetChoices={enableGetChoices}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            );

            // not call on start
            await waitFor(() => {
                expect(dataProvider.getList).not.toHaveBeenCalled();
            });
            expect(enableGetChoices).toHaveBeenCalledWith({ q: '' });

            const { setFilter } = children.mock.calls[0][0];
            setFilter('hello world');

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
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                field={{ value: [5, 6] }}
                                enableGetChoices={() => false}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
                </CoreAdminContext>
            );
            await waitFor(() => {
                expect(dataProvider.getMany).toHaveBeenCalledWith('tags', {
                    ids: [5, 6],
                });
            });
        });

        it('should set isLoading to false if enableGetChoices returns false', async () => {
            const children = jest.fn().mockReturnValue(<div />);
            await new Promise(resolve => setTimeout(resolve, 100)); // empty the query deduplication in useQueryWithStore
            const enableGetChoices = jest.fn().mockImplementation(({ q }) => {
                return false;
            });
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={() => (
                            <ReferenceArrayInputController
                                {...defaultProps}
                                allowEmpty
                                enableGetChoices={enableGetChoices}
                            >
                                {children}
                            </ReferenceArrayInputController>
                        )}
                    />
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
