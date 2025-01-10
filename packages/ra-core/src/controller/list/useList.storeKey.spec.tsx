import * as React from 'react';
import {
    render,
    fireEvent,
    screen,
    waitFor,
    act,
} from '@testing-library/react';
import {
    ListsWithoutStoreKeys,
    ListsWithStoreKeys,
} from './useList.storekey.stories';
import { TestMemoryRouter } from '../../routing';

beforeEach(() => {
    // Clear localStorage or mock store to reset state
    localStorage.clear();
});

describe('useList', () => {
    describe('storeKey', () => {
        it('should keep distinct two lists of the same resource given different keys', async () => {
            render(
                <TestMemoryRouter initialEntries={['/top']}>
                    <ListsWithStoreKeys />
                </TestMemoryRouter>
            );

            // Wait for the initial state of perPage to stabilize
            await waitFor(() => {
                const perPageValue = screen
                    .getByLabelText('perPage')
                    .getAttribute('data-value');
                expect(perPageValue).toEqual('3');
            });

            act(() => {
                fireEvent.click(screen.getByLabelText('incrementPerPage'));
            });

            await waitFor(() => {
                const perPageValue = screen
                    .getByLabelText('perPage')
                    .getAttribute('data-value');
                expect(perPageValue).toEqual('4');
            });

            // Navigate to "flop" list
            act(() => {
                fireEvent.click(screen.getByLabelText('flop'));
            });

            await waitFor(() => {
                const perPageValue = screen
                    .getByLabelText('perPage')
                    .getAttribute('data-value');
                expect(perPageValue).toEqual('3');
            });
        });

        it('should not use the store when storeKey is false', async () => {
            render(
                <TestMemoryRouter initialEntries={['/store']}>
                    <ListsWithoutStoreKeys />
                </TestMemoryRouter>
            );

            await waitFor(() => {
                expect(
                    screen.getByLabelText('perPage').getAttribute('data-value')
                ).toEqual('3');
            });

            act(() => {
                fireEvent.click(screen.getByLabelText('incrementPerPage'));
                fireEvent.click(screen.getByLabelText('incrementPerPage'));
            });

            await waitFor(() => {
                expect(
                    screen.getByLabelText('perPage').getAttribute('data-value')
                ).toEqual('5');
            });

            act(() => {
                fireEvent.click(screen.getByLabelText('nostore'));
            });

            await waitFor(() => {
                const storeKey = screen
                    .getByLabelText('nostore')
                    .getAttribute('data-value');
                expect(storeKey).toEqual(null);
            });

            expect(
                screen.getByLabelText('perPage').getAttribute('data-value')
            ).toEqual('3');

            act(() => {
                fireEvent.click(screen.getByLabelText('incrementPerPage'));
            });

            await waitFor(() => {
                expect(
                    screen.getByLabelText('perPage').getAttribute('data-value')
                ).toEqual('4');
            });

            act(() => {
                fireEvent.click(screen.getByLabelText('store'));
            });
            // Shouldn't have changed the store list
            await waitFor(() => {
                const perPageValue = screen
                    .getByLabelText('perPage')
                    .getAttribute('data-value');
                expect(perPageValue).toEqual('5');
            });

            act(() => {
                fireEvent.click(screen.getByLabelText('nostore'));
            });
            // Should have reset its parameters to their default
            expect(
                screen.getByLabelText('perPage').getAttribute('data-value')
            ).toEqual('3');
        });
    });
});
