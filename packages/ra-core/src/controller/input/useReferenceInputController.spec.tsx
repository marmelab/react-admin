import * as React from 'react';
import { useState, useCallback, ReactElement } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import expect from 'expect';

import { useReferenceInputController } from './useReferenceInputController';
import { CoreAdminContext } from '../../core';
import { Form, useInput } from '../../form';
import { testDataProvider } from '../../dataProvider';

const ReferenceInputController = props => {
    const { children, ...rest } = props;
    const inputProps = useInput({
        ...rest,
    });
    return children(
        useReferenceInputController({ ...rest, ...inputProps })
    ) as ReactElement;
};

describe('useReferenceInputController', () => {
    const defaultProps = {
        children: jest.fn(),
        onChange: jest.fn(),
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
    };

    const dataProvider = testDataProvider({
        getMany: jest
            .fn()
            .mockResolvedValue({ data: [{ id: 1, title: 'foo' }] }),
        getList: jest.fn().mockResolvedValue({
            data: [
                { id: 1, title: 'foo' },
                { id: 2, title: 'bar' },
            ],
            total: 2,
        }),
    });

    afterEach(() => {
        // @ts-ignore
        dataProvider.getMany.mockClear();
        // @ts-ignore
        dataProvider.getList.mockClear();
    });

    it('should fetch possible values using getList', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form>
                    <ReferenceInputController {...defaultProps}>
                        {children}
                    </ReferenceInputController>
                </Form>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        expect(dataProvider.getList).toBeCalledWith('posts', {
            filter: {},
            meta: undefined,
            pagination: {
                page: 1,
                perPage: 25,
            },
            sort: {
                field: 'id',
                order: 'ASC',
            },
            signal: undefined,
        });
    });

    it('should allow getList pagination and sorting customization', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form>
                    <ReferenceInputController
                        {...defaultProps}
                        page={5}
                        perPage={10}
                        sort={{ field: 'title', order: 'ASC' }}
                    >
                        {children}
                    </ReferenceInputController>
                </Form>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
            expect(dataProvider.getList).toBeCalledWith('posts', {
                filter: {},
                meta: undefined,
                pagination: {
                    page: 5,
                    perPage: 10,
                },
                sort: {
                    field: 'title',
                    order: 'ASC',
                },
                signal: undefined,
            });
        });
    });

    it('should fetch current value using getMany', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form defaultValues={{ post_id: 1 }}>
                    <ReferenceInputController {...defaultProps}>
                        {children}
                    </ReferenceInputController>
                </Form>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
            expect(dataProvider.getMany).toBeCalledTimes(1);
            expect(dataProvider.getMany).toBeCalledWith('posts', {
                ids: [1],
                signal: undefined,
            });
        });
    });

    it('should not fetch current value using getMany if it is empty', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form defaultValues={{ post_id: '' }}>
                    <ReferenceInputController {...defaultProps}>
                        {children}
                    </ReferenceInputController>
                </Form>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(dataProvider.getMany).not.toHaveBeenCalled();
    });

    it('should pass possibleValues and record to child', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form defaultValues={{ post_id: 1 }}>
                    <ReferenceInputController
                        {...defaultProps}
                        loading
                        sort={{ field: 'title', order: 'ASC' }}
                    >
                        {children}
                    </ReferenceInputController>
                </Form>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(children.mock.calls.length).toBeGreaterThanOrEqual(3);
        });
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                allChoices: [
                    { id: 1, title: 'foo' },
                    { id: 2, title: 'bar' },
                ],
                availableChoices: [
                    { id: 1, title: 'foo' },
                    { id: 2, title: 'bar' },
                ],
                selectedChoices: [{ id: 1, title: 'foo' }],
                displayedFilters: {},
                error: null,
                filter: {},
                filterValues: {},
                isFetching: false,
                isLoading: false,
                page: 1,
                perPage: 25,
                hasPreviousPage: false,
                hasNextPage: false,
                hideFilter: expect.any(Function),
                setFilters: expect.any(Function),
                setPage: expect.any(Function),
                setPerPage: expect.any(Function),
                setSort: expect.any(Function),
                showFilter: expect.any(Function),
                sort: { field: 'title', order: 'ASC' },
                refetch: expect.any(Function),
                resource: 'posts',
                source: 'post_id',
                total: 2,
            })
        );
    });

    it('should refetch reference getList when its props change', async () => {
        const children = jest.fn().mockReturnValue(<p>child</p>);
        const Component = () => {
            const [sort, setSort] = useState({ field: 'title', order: 'ASC' });
            const handleClick = useCallback(
                () => setSort({ field: 'body', order: 'DESC' }),
                [setSort]
            );
            return (
                <>
                    <button aria-label="Change sort" onClick={handleClick} />
                    <ReferenceInputController {...defaultProps} sort={sort}>
                        {children}
                    </ReferenceInputController>
                </>
            );
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form>
                    <Component />
                </Form>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', {
            filter: {},
            meta: undefined,
            pagination: {
                page: 1,
                perPage: 25,
            },
            sort: {
                field: 'title',
                order: 'ASC',
            },
            signal: undefined,
        });

        fireEvent.click(screen.getByLabelText('Change sort'));
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(2);
        });
        expect(dataProvider.getList).toHaveBeenCalledWith('posts', {
            filter: {},
            meta: undefined,
            pagination: {
                page: 1,
                perPage: 25,
            },
            sort: {
                field: 'body',
                order: 'DESC',
            },
            signal: undefined,
        });
    });

    describe('enableGetChoices', () => {
        it('should not fetch possible values using getList on load but only when enableGetChoices returns true', async () => {
            const children = jest.fn().mockReturnValue(<p>child</p>);
            const enableGetChoices = jest.fn().mockImplementation(({ q }) => {
                return !!q && q.length > 2;
            });
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form defaultValues={{ post_id: 1 }}>
                        <ReferenceInputController
                            {...defaultProps}
                            enableGetChoices={enableGetChoices}
                        >
                            {children}
                        </ReferenceInputController>
                    </Form>
                </CoreAdminContext>
            );

            // not call on start
            await waitFor(() => {
                expect(dataProvider.getList).toBeCalledTimes(0);
                expect(enableGetChoices).toHaveBeenCalledWith({});
            });

            const { setFilters } = children.mock.calls[0][0];
            setFilters({ q: 'hello world' });

            await waitFor(() => {
                expect(dataProvider.getList).toBeCalledTimes(1);
            });
            expect(enableGetChoices).toHaveBeenCalledWith({
                q: 'hello world',
            });
        });

        it('should fetch current value using getMany even if enableGetChoices is returning false', async () => {
            const children = jest.fn().mockReturnValue(<p>child</p>);
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Form defaultValues={{ post_id: 1 }}>
                        <ReferenceInputController
                            {...defaultProps}
                            enableGetChoices={() => false}
                        >
                            {children}
                        </ReferenceInputController>
                    </Form>
                </CoreAdminContext>
            );

            await waitFor(() => {
                expect(dataProvider.getList).toBeCalledTimes(0);
                expect(dataProvider.getMany).toBeCalledTimes(1);
            });
        });
    });
});
