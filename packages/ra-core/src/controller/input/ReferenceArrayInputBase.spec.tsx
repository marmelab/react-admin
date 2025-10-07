import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { testDataProvider } from 'ra-core';
import { Basic, Offline, WithError } from './ReferenceArrayInputBase.stories';
import { onlineManager } from '@tanstack/react-query';

describe('<ReferenceArrayInputBase>', () => {
    beforeEach(() => {
        onlineManager.setOnline(true);
    });
    afterEach(async () => {
        // wait for the getManyAggregate batch to resolve
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
    });

    it('should pass down the error if any occurred', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<WithError />);
        await waitFor(() => {
            expect(screen.queryByText('Error: fetch error')).not.toBeNull();
        });
    });
    it('should pass the correct resource down to child component', async () => {
        render(<Basic />);
        // Check that the child component receives the correct resource (tags)
        await screen.findByText('Selected tags: 1, 3');
    });

    it('should provide a ChoicesContext with all available choices', async () => {
        render(<Basic />);
        await screen.findByText('Total tags: 5');
    });

    it('should apply default values', async () => {
        render(<Basic />);
        // Check that the default values are applied (1, 3)
        await screen.findByText('Selected tags: 1, 3');
    });

    it('should accept meta in queryOptions', async () => {
        const getList = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: [], total: 25 })
            );
        const dataProvider = testDataProvider({ getList });
        render(<Basic meta dataProvider={dataProvider} />);
        await waitFor(() => {
            expect(getList).toHaveBeenCalledWith('tags', {
                filter: {},
                pagination: { page: 1, perPage: 25 },
                sort: { field: 'id', order: 'DESC' },
                meta: { foo: 'bar' },
                signal: undefined,
            });
        });
    });

    it('should render the offline prop node when offline', async () => {
        render(<Offline />);
        fireEvent.click(await screen.findByText('Simulate offline'));
        fireEvent.click(await screen.findByText('Toggle Child'));
        await screen.findByText('You are offline, cannot load data');
        fireEvent.click(await screen.findByText('Simulate online'));
        await screen.findByText('Architecture');
    });
});
