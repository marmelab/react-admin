import * as React from 'react';
import {
    render,
    fireEvent,
    screen,
    waitFor,
    act,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { ListsUsingSameResource } from './useListController.storeKey.stories';

describe('useListController', () => {
    describe('customStoreKey', () => {
        it('should keep distinct two lists of the same resource given different keys', async () => {
            render(
                <ListsUsingSameResource
                    history={createMemoryHistory({
                        initialEntries: ['/top'],
                    })}
                />
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
    });
});
