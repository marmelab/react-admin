import * as React from 'react';
import {
    render,
    fireEvent,
    screen,
    waitFor,
    act,
} from '@testing-library/react';
import {
    ListsUsingSameResource,
    ListsWithoutStore,
} from './useListController.storeKey.stories';
import { TestMemoryRouter } from '../../routing';

describe('useListController', () => {
    describe('storeKey', () => {
        it('should keep distinct two lists of the same resource given different keys', async () => {
            render(
                <TestMemoryRouter initialEntries={['/top']}>
                    <ListsUsingSameResource />
                </TestMemoryRouter>
            );

            await waitFor(() => {
                expect(
                    screen.getByLabelText('perPage').getAttribute('data-value')
                ).toEqual('3');
            });

            act(() => {
                fireEvent.click(screen.getByLabelText('incrementPerPage'));
            });

            await waitFor(() => {
                expect(
                    screen.getByLabelText('perPage').getAttribute('data-value')
                ).toEqual('4');
            });

            act(() => {
                fireEvent.click(screen.getByLabelText('flop'));
            });
            expect(
                screen.getByLabelText('perPage').getAttribute('data-value')
            ).toEqual('3');
        });

        it('should not use the store when storeKey is false', async () => {
            render(
                <TestMemoryRouter initialEntries={['/store']}>
                    <ListsWithoutStore />
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
                expect(
                    screen.getByLabelText('perPage').getAttribute('data-value')
                ).toEqual('5');
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
