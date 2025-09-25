import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { testDataProvider } from '../../dataProvider/testDataProvider';
import { CoreAdminContext } from '../../core/CoreAdminContext';
import { TestMemoryRouter } from '../../routing/TestMemoryRouter';
import { useDeleteController } from './useDeleteController';
import { RecordContextProvider } from '../record';
import { ResourceContextProvider } from '../..';

describe('useDeleteController', () => {
    it('should get the record and the resource from closest context providers', async () => {
        const dataProvider = testDataProvider({
            delete: jest.fn((ressource, params) => {
                return Promise.resolve({ data: params?.previousData });
            }),
        });

        const MockComponent = () => {
            const { handleDelete } = useDeleteController({
                mutationMode: 'pessimistic',
            });
            return <button onClick={handleDelete}>Delete</button>;
        };

        render(
            <TestMemoryRouter>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ResourceContextProvider value="posts">
                                    <RecordContextProvider value={{ id: 1 }}>
                                        <MockComponent />
                                    </RecordContextProvider>
                                </ResourceContextProvider>
                            }
                        />
                    </Routes>
                </CoreAdminContext>
            </TestMemoryRouter>
        );

        const button = await screen.findByText('Delete');
        fireEvent.click(button);

        await waitFor(() =>
            expect(dataProvider.delete).toHaveBeenCalledWith('posts', {
                id: 1,
                previousData: { id: 1 },
            })
        );
    });
    it('should allow to override the record and the resource from closest context providers', async () => {
        const dataProvider = testDataProvider({
            delete: jest.fn((ressource, params) => {
                return Promise.resolve({ data: params?.previousData });
            }),
        });

        const MockComponent = () => {
            const { handleDelete } = useDeleteController({
                resource: 'comments',
                record: { id: 2 },
                mutationMode: 'pessimistic',
            });
            return <button onClick={handleDelete}>Delete</button>;
        };

        render(
            <TestMemoryRouter>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ResourceContextProvider value="posts">
                                    <RecordContextProvider value={{ id: 1 }}>
                                        <MockComponent />
                                    </RecordContextProvider>
                                </ResourceContextProvider>
                            }
                        />
                    </Routes>
                </CoreAdminContext>
            </TestMemoryRouter>
        );

        const button = await screen.findByText('Delete');
        fireEvent.click(button);

        await waitFor(() =>
            expect(dataProvider.delete).toHaveBeenCalledWith('comments', {
                id: 2,
                previousData: { id: 2 },
            })
        );
    });
});
