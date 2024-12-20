import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';

import { Basic, SelectAll, Sort } from './useList.stories';

describe('<useList />', () => {
    it('should apply sorting correctly', async () => {
        const callback = jest.fn();
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];

        const { getByText } = render(
            <Sort
                data={data}
                sort={{ field: 'title', order: 'DESC' }}
                callback={callback}
            />
        );

        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    sort: { field: 'title', order: 'DESC' },
                    isFetching: false,
                    isLoading: false,
                    data: [
                        { id: 2, title: 'world' },
                        { id: 1, title: 'hello' },
                    ],
                    error: null,
                    total: 2,
                })
            );
        });

        fireEvent.click(getByText('Sort by title ASC'));
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    sort: { field: 'title', order: 'ASC' },
                    isFetching: false,
                    isLoading: false,
                    data: [
                        { id: 1, title: 'hello' },
                        { id: 2, title: 'world' },
                    ],
                    error: null,
                    total: 2,
                })
            );
        });
    });

    it('should apply pagination correctly', async () => {
        const callback = jest.fn();
        render(<Basic page={2} perPage={5} callback={callback} />);

        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    sort: { field: 'id', order: 'ASC' },
                    isFetching: false,
                    isLoading: false,
                    data: [
                        { id: 6, title: 'And Then There Were None' },
                        { id: 7, title: 'Dream of the Red Chamber' },
                        { id: 8, title: 'The Hobbit' },
                        { id: 9, title: 'She: A History of Adventure' },
                        {
                            id: 10,
                            title: 'The Lion, the Witch and the Wardrobe',
                        },
                    ],
                    page: 2,
                    perPage: 5,
                    error: null,
                    total: 10,
                })
            );
        });
    });

    it('should be usable with asynchronously fetched data', () => {
        const callback = jest.fn();
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];

        const { rerender } = render(
            <Basic filter={{ title: 'world' }} callback={callback} />
        );

        rerender(
            <Basic
                data={data}
                isFetching={true}
                isLoading={false}
                filter={{ title: 'world' }}
                callback={callback}
            />
        );

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: { field: 'id', order: 'ASC' },
                isFetching: true,
                isLoading: false,
                data: [{ id: 2, title: 'world' }],
                error: null,
                total: 1,
            })
        );
    });

    describe('filter', () => {
        it('should filter string data based on the filter props', () => {
            const callback = jest.fn();
            render(
                <Basic filter={{ title: 'The Hobbit' }} callback={callback} />
            );

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    sort: { field: 'id', order: 'ASC' },
                    isFetching: false,
                    isLoading: false,
                    data: [{ id: 8, title: 'The Hobbit' }],
                    error: null,
                    total: 1,
                })
            );
        });

        it('should filter array data based on the filter props', async () => {
            const callback = jest.fn();
            const data = [
                { id: 1, items: ['one', 'two'] },
                { id: 2, items: ['three'] },
                { id: 3, items: 'four' },
                { id: 4, items: ['five'] },
            ];

            render(
                <Basic
                    data={data}
                    filter={{ items: ['two', 'four', 'five'] }}
                    callback={callback}
                />
            );

            await waitFor(() => {
                expect(callback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        sort: { field: 'id', order: 'ASC' },
                        isFetching: false,
                        isLoading: false,
                        data: [
                            { id: 1, items: ['one', 'two'] },
                            { id: 3, items: 'four' },
                            { id: 4, items: ['five'] },
                        ],
                        error: null,
                        total: 3,
                    })
                );
            });
        });

        it('should filter array data based on the custom filter', async () => {
            const callback = jest.fn();
            const data = [
                { id: 1, items: ['one', 'two'] },
                { id: 2, items: ['three'] },
                { id: 3, items: 'four' },
                { id: 4, items: ['five'] },
            ];

            render(
                <Basic
                    data={data}
                    sort={{ field: 'id', order: 'ASC' }}
                    filterCallback={record => record.id > 2}
                    callback={callback}
                />
            );

            await waitFor(() => {
                expect(callback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        sort: { field: 'id', order: 'ASC' },
                        isFetching: false,
                        isLoading: false,
                        data: [
                            { id: 3, items: 'four' },
                            { id: 4, items: ['five'] },
                        ],
                        error: null,
                        total: 2,
                    })
                );
            });
        });

        it('should filter data based on a custom filter with nested objects', () => {
            const callback = jest.fn();
            const data = [
                { id: 1, title: { name: 'hello' } },
                { id: 2, title: { name: 'world' } },
            ];

            render(
                <Basic
                    data={data}
                    filter={{ title: { name: 'world' } }}
                    callback={callback}
                >
                    children
                </Basic>
            );

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    sort: { field: 'id', order: 'ASC' },
                    isFetching: false,
                    isLoading: false,
                    data: [{ id: 2, title: { name: 'world' } }],
                    error: null,
                    total: 1,
                })
            );
        });

        it('should apply the q filter as a full-text filter', () => {
            const callback = jest.fn();
            render(<Basic filter={{ q: 'The' }} callback={callback} />);

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: [
                        { id: 2, title: 'The Little Prince' },
                        { id: 5, title: 'The Lord of the Rings' },
                        { id: 6, title: 'And Then There Were None' },
                        { id: 7, title: 'Dream of the Red Chamber' },
                        { id: 8, title: 'The Hobbit' },
                        {
                            id: 10,
                            title: 'The Lion, the Witch and the Wardrobe',
                        },
                    ],
                })
            );
        });
    });

    describe('onSelectAll', () => {
        it('should select all records', async () => {
            render(<SelectAll />);
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: []'
                );
            });
            fireEvent.click(screen.getByRole('button', { name: 'Select All' }));
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: [1,2,3,4,5,6,7,8,9,10]'
                );
            });
        });
        it('should select all records even though some records are already selected', async () => {
            render(<SelectAll />);
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: []'
                );
            });
            fireEvent.click(
                screen.getByRole('button', { name: 'Select item 1' })
            );
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: [1]'
                );
            });
            fireEvent.click(screen.getByRole('button', { name: 'Select All' }));
            await waitFor(() => {
                expect(screen.getByTestId('selected_ids').textContent).toBe(
                    'Selected ids: [1,2,3,4,5,6,7,8,9,10]'
                );
            });
        });
    });
});
