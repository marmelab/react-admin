import React from 'react';
import expect from 'expect';
import { MemoryRouter, Route, Routes } from 'react-router';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';

import { testDataProvider } from '../../dataProvider';
import { CoreAdminContext } from '../../core';
import useDeleteWithConfirmController, {
    UseDeleteWithConfirmControllerParams,
} from './useDeleteWithConfirmController';

describe('useDeleteWithConfirmController', () => {
    it('should call the dataProvider.delete() function with the meta param', async () => {
        let receivedMeta = null;
        const dataProvider = testDataProvider({
            delete: jest.fn((ressource, params) => {
                receivedMeta = params?.meta?.key;
                return Promise.resolve({ data: params?.meta?.key });
            }),
        });

        const MockComponent = () => {
            const { handleDelete } = useDeleteWithConfirmController({
                record: { id: 1 },
                resource: 'posts',
                mutationMode: 'pessimistic',
                mutationOptions: { meta: { key: 'metadata' } },
            } as UseDeleteWithConfirmControllerParams);
            return <button onClick={handleDelete}>Delete</button>;
        };

        render(
            <MemoryRouter>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route path="/" element={<MockComponent />} />
                    </Routes>
                </CoreAdminContext>
            </MemoryRouter>
        );

        const button = await screen.findByText('Delete');
        fireEvent.click(button);
        waitFor(() => expect(receivedMeta).toEqual('metadata'), {
            timeout: 1000,
        });
    });
});
