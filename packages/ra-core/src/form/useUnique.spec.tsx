import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    Create,
    DataProviderErrorOnValidation,
    DeepField,
    Edit,
    WithAdditionalFilters,
    WithMessage,
} from './useUnique.stories';
import { testDataProvider } from '../dataProvider';
import { DataProvider } from '../types';

describe('useUnique', () => {
    const baseDataProvider = (overrides?: Partial<DataProvider>) =>
        testDataProvider({
            // @ts-ignore
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 1, name: 'John Doe' }],
                    total: 1,
                })
            ),
            // @ts-ignore
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
            ...overrides,
        });

    it('should show the default error when the field value already exists', async () => {
        const dataProvider = baseDataProvider();
        render(<Create dataProvider={dataProvider} />);

        await screen.findByDisplayValue('John Doe');

        fireEvent.click(screen.getByText('Submit'));
        await screen.findByText('Must be unique');
        expect(dataProvider.getList).toHaveBeenCalledWith('users', {
            filter: {
                name: 'John Doe',
            },
            pagination: {
                page: 1,
                perPage: 1,
            },
            sort: {
                field: 'id',
                order: 'ASC',
            },
        });
        expect(dataProvider.create).not.toHaveBeenCalled();
    });

    it('should not show the error when the field value already exists but only for the current record', async () => {
        const dataProvider = baseDataProvider({
            // @ts-ignore
            getList: jest.fn((resource, params) =>
                params.filter.name === 'John Doe'
                    ? Promise.resolve({
                          data: [{ id: 1, name: 'John Doe' }],
                          total: 1,
                      })
                    : Promise.resolve({
                          data: [{ id: 2, name: 'Jane Doe' }],
                          total: 1,
                      })
            ),
            // @ts-ignore
            getOne: jest.fn(() =>
                Promise.resolve({
                    data: { id: 1, name: 'John Doe' },
                })
            ),
            // @ts-ignore
            update: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
        });
        render(<Edit dataProvider={dataProvider} id={1} />);

        await waitFor(() =>
            expect(dataProvider.getOne).toHaveBeenCalledWith('users', {
                id: 1,
            })
        );
        fireEvent.change(screen.getByDisplayValue('John Doe'), {
            target: { value: 'Jane Doe' },
        });
        fireEvent.blur(screen.getByDisplayValue('Jane Doe'));
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() =>
            expect(dataProvider.getList).toHaveBeenCalledWith('users', {
                filter: {
                    name: 'Jane Doe',
                },
                pagination: {
                    page: 1,
                    perPage: 1,
                },
                sort: {
                    field: 'id',
                    order: 'ASC',
                },
            })
        );
        await screen.findByText('Must be unique');
        fireEvent.change(screen.getByDisplayValue('Jane Doe'), {
            target: { value: 'John Doe' },
        });
        await waitFor(() =>
            expect(screen.queryByText('Must be unique')).toBeNull()
        );
    });

    it('should not show the default error when the field value does not already exist', async () => {
        const dataProvider = baseDataProvider({
            // @ts-ignore
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [],
                    total: 0,
                })
            ),
        });

        render(<Create dataProvider={dataProvider} />);

        await screen.findByDisplayValue('John Doe');
        fireEvent.change(screen.getByDisplayValue('John Doe'), {
            target: { value: 'Jordan Doe' },
        });

        await waitFor(() => {
            expect(screen.queryByText('Must be unique')).toBeNull();
        });

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(
            () => {
                expect(dataProvider.create).toHaveBeenCalled();
            },
            { timeout: 5000 }
        );
    });

    it('should show a custom error when the field value already exists and message is provided', async () => {
        const dataProvider = baseDataProvider();
        render(<WithMessage dataProvider={dataProvider} />);

        await screen.findByDisplayValue('John Doe');
        fireEvent.click(screen.getByText('Submit'));

        await screen.findByText(
            'Someone is already registered with this name',
            {},
            { timeout: 5000 }
        );
        expect(dataProvider.create).not.toHaveBeenCalled();
    });

    it('should not show the custom error when the field value does not already exist and a message is provided', async () => {
        const dataProvider = baseDataProvider({
            // @ts-ignore
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [],
                    total: 0,
                })
            ),
        });
        render(<WithMessage dataProvider={dataProvider} />);

        await screen.findByDisplayValue('John Doe');
        fireEvent.change(screen.getByDisplayValue('John Doe'), {
            target: { value: 'Jordan Doe' },
        });

        fireEvent.click(screen.getByText('Submit'));
        await waitFor(
            () => {
                expect(dataProvider.create).toHaveBeenCalled();
            },
            { timeout: 5000 }
        );
        expect(
            screen.queryByText('Someone is already registered with this name')
        ).toBeNull();
    });

    it('should call the dataProvider with additional filter when provided', async () => {
        const dataProvider = baseDataProvider();
        render(<WithAdditionalFilters dataProvider={dataProvider} />);

        await screen.findByDisplayValue('John Doe');

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(
            () => {
                expect(dataProvider.getList).toHaveBeenCalledWith('users', {
                    filter: {
                        name: 'John Doe',
                        organization_id: 1,
                    },
                    pagination: {
                        page: 1,
                        perPage: 1,
                    },
                    sort: {
                        field: 'id',
                        order: 'ASC',
                    },
                });
            },
            { timeout: 5000 }
        );
        await screen.findByText('Must be unique');
    });

    it('should work with deep paths', async () => {
        const dataProvider = baseDataProvider();
        render(<DeepField dataProvider={dataProvider} />);

        await screen.findByDisplayValue('John Doe');

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('users', {
                filter: {
                    identity: {
                        name: 'John Doe',
                    },
                },
                pagination: {
                    page: 1,
                    perPage: 1,
                },
                sort: {
                    field: 'id',
                    order: 'ASC',
                },
            });
        });
        await screen.findByText('Must be unique');
        expect(dataProvider.create).not.toHaveBeenCalled();
    });

    it('should show an error when the dataProvider fails', async () => {
        render(<DataProviderErrorOnValidation />);

        await screen.findByDisplayValue('John Doe');
        // The dataProvider for this story fails one over two times
        // Here's the first time, it should show an error
        fireEvent.click(screen.getByText('Submit'));
        expect(screen.queryByText('Server communication error')).toBeNull();

        // Here's the second time, it should show the validation message
        fireEvent.click(screen.getByText('Submit'));
        expect(screen.queryByText('Must be unique')).toBeNull();
    });
});
