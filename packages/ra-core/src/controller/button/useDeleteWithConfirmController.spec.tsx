import React from 'react';
import expect from 'expect';
import { Route, Routes } from 'react-router';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';

import { testDataProvider } from '../../dataProvider';
import { CoreAdminContext } from '../../core';
import useDeleteWithConfirmController, {
    UseDeleteWithConfirmControllerParams,
} from './useDeleteWithConfirmController';

import { TestMemoryRouter } from '../../routing';
import { useNotificationContext } from '../../notification';

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
            <TestMemoryRouter>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route path="/" element={<MockComponent />} />
                    </Routes>
                </CoreAdminContext>
            </TestMemoryRouter>
        );

        const button = await screen.findByText('Delete');
        fireEvent.click(button);
        waitFor(() => expect(receivedMeta).toEqual('metadata'), {
            timeout: 1000,
        });
    });

    it('should display success message after successful deletion', async () => {
        const successMessage = 'Test Message';
        const dataProvider = testDataProvider({
            delete: jest.fn().mockResolvedValue({ data: {} }),
        });

        const MockComponent = () => {
            const { handleDelete } = useDeleteWithConfirmController({
                record: { id: 1 },
                resource: 'posts',
                successMessage,
            } as UseDeleteWithConfirmControllerParams);
            return <button onClick={handleDelete}>Delete</button>;
        };

        let notificationsSpy;
        const Notification = () => {
            const { notifications } = useNotificationContext();
            React.useEffect(() => {
                notificationsSpy = notifications;
            }, [notifications]);
            return null;
        };

        render(
            <TestMemoryRouter>
                <CoreAdminContext dataProvider={dataProvider}>
                    <MockComponent />
                    <Notification />
                </CoreAdminContext>
            </TestMemoryRouter>
        );

        const button = screen.getByText('Delete');
        fireEvent.click(button);

        await waitFor(() => {
            expect(notificationsSpy).toEqual([
                {
                    message: successMessage,
                    type: 'info',
                    notificationOptions: {
                        messageArgs: {
                            smart_count: 1,
                            _: 'ra.notification.deleted',
                        },
                        undoable: false,
                    },
                },
            ]);
        });
    });
});
