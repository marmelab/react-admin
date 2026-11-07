import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';

import { Basic, SelectAll, Sort } from './useList.stories';
import { useListContext } from './useListContext';

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

    it('should sort records without a value as the highest values', async () => {
        const callback = jest.fn();
        const data = [
            { id: 1, title: 'c' },
            { id: 2, title: null },
            { id: 3, title: 'a' },
            { id: 4 },
            { id: 5, title: 'b' },
        ];

        const { getByText } = render(
            <Sort
                data={data}
                sort={{ field: 'title', order: 'ASC' }}
                callback={callback}
            />
        );

        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    sort: { field: 'title', order: 'ASC' },
                    data: [
                        { id: 3, title: 'a' },
                        { id: 5, title: 'b' },
                        { id: 1, title: 'c' },
                        { id: 2, title: null },
                        { id: 4 },
                    ],
                })
            );
        });

        fireEvent.click(getByText('Sort by title DESC'));
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    sort: { field: 'title', order: 'DESC' },
                    data: [
                        { id: 2, title: null },
                        { id: 4 },
                        { id: 1, title: 'c' },
                        { id: 5, title: 'b' },
                        { id: 3, title: 'a' },
                    ],
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

    it('should apply filter, sort and pagination on the first render', () => {
        const callback = jest.fn();
        render(
            <Basic
                filter={{ q: 'The' }}
                sort={{ field: 'title', order: 'ASC' }}
                perPage={2}
                callback={callback}
            />
        );

        expect(callback.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                data: [
                    { id: 6, title: 'And Then There Were None' },
                    { id: 7, title: 'Dream of the Red Chamber' },
                ],
                total: 6,
                hasNextPage: true,
            })
        );
    });

    it('should not mutate the data prop when sorting', () => {
        const callback = jest.fn();
        const data = [
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ];

        render(
            <Basic
                data={data}
                filter={null}
                sort={{ field: 'title', order: 'DESC' }}
                callback={callback}
            />
        );

        expect(callback.mock.calls[0][0].data).toEqual([
            { id: 2, title: 'world' },
            { id: 1, title: 'hello' },
        ]);
        expect(data).toEqual([
            { id: 1, title: 'hello' },
            { id: 2, title: 'world' },
        ]);
    });

    it('should return an empty list with a total of 0 when there is no data', () => {
        const callback = jest.fn();
        const { rerender } = render(
            <Basic data={undefined} callback={callback} />
        );
        rerender(<Basic data={undefined} callback={callback} />);

        expect(callback.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                isPending: false,
                error: null,
                data: [],
                total: 0,
                hasNextPage: false,
            })
        );
        expect(callback.mock.calls[1][0].data).toBe(
            callback.mock.calls[0][0].data
        );
    });

    it('should return an empty list with a total of 0 when data becomes undefined', () => {
        const callback = jest.fn();
        const { rerender } = render(<Basic callback={callback} />);
        rerender(<Basic data={undefined} callback={callback} />);

        expect(callback).toHaveBeenLastCalledWith(
            expect.objectContaining({
                isPending: false,
                data: [],
                total: 0,
            })
        );
    });

    it('should not return data nor total while pending', () => {
        const callback = jest.fn();
        const { rerender } = render(<Basic callback={callback} />);
        rerender(<Basic isPending callback={callback} />);

        expect(callback).toHaveBeenLastCalledWith(
            expect.objectContaining({
                isPending: true,
                data: undefined,
                total: undefined,
            })
        );
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
        it('should never render children with the previous filter when the filter prop changes', () => {
            const renderedTitles: string[][] = [];
            const TitlesRecorder = () => {
                const { data } = useListContext();
                renderedTitles.push(data.map(record => record.title));
                return null;
            };

            const { rerender } = render(
                <Basic filter={{ title: 'War and Peace' }}>
                    <TitlesRecorder />
                </Basic>
            );
            rerender(
                <Basic filter={{ title: 'The Hobbit' }}>
                    <TitlesRecorder />
                </Basic>
            );

            expect(renderedTitles).toEqual([['War and Peace'], ['The Hobbit']]);
        });

        it('should go back to the first page when the filter prop changes', async () => {
            const { rerender } = render(<Basic page={3} perPage={2} />);
            await screen.findByText('5 - The Lord of the Rings');

            rerender(<Basic page={3} perPage={2} filter={{ q: 'The' }} />);

            await screen.findByText('2 - The Little Prince');
            expect(
                screen.queryByText('5 - The Lord of the Rings')
            ).not.toBeNull();
            expect(
                screen.queryByText('6 - And Then There Were None')
            ).toBeNull();
        });

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
