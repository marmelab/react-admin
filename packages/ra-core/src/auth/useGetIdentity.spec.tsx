import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Basic, ErrorCase, ResetIdentity } from './useGetIdentity.stories';
import useGetIdentity from './useGetIdentity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';

describe('useGetIdentity', () => {
    it('should return the identity', async () => {
        render(<Basic />);
        await screen.findByText('John Doe');
    });
    it('should return the authProvider error', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        render(<ErrorCase />);
        await screen.findByText('Error');
    });
    it('should allow to update the identity after a change', async () => {
        render(<ResetIdentity />);
        expect(await screen.findByText('John Doe')).not.toBeNull();
        const input = screen.getByDisplayValue('John Doe');
        fireEvent.change(input, { target: { value: 'Jane Doe' } });
        fireEvent.click(screen.getByText('Save'));
        await screen.findByText('Jane Doe');
        expect(screen.queryByText('John Doe')).toBeNull();
    });
    it('should not throw errors when there is no authProvider.getIdentity', async () => {
        const authProvider = {
            login: () => Promise.resolve(),
            logout: () => Promise.resolve(),
            checkAuth: () => Promise.resolve(),
            checkError: () => Promise.resolve(),
            getPermissions: () => Promise.resolve(),
        };
        const Identity = () => {
            const { data, error, isPending } = useGetIdentity({ retry: false });
            return isPending ? (
                <>Loading</>
            ) : error ? (
                <>{`Error: ${error.message}`}</>
            ) : (
                <>{JSON.stringify(data)}</>
            );
        };
        render(
            <QueryClientProvider client={new QueryClient()}>
                <AuthContext.Provider value={authProvider}>
                    <Identity />
                </AuthContext.Provider>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(screen.queryByText('Loading')).toBeNull();
        });
        expect(screen.queryByText(/Error/)).toBeNull();
        expect(screen.queryByText('{"id":""}')).not.toBeNull();
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const authProvider = {
            getIdentity: jest.fn(
                ({ signal }) =>
                    new Promise(() => {
                        signal.addEventListener('abort', () => {
                            abort(signal.reason);
                        });
                    })
            ) as any,
        } as any;
        const queryClient = new QueryClient();
        const Identity = () => {
            const { data, error, isPending } = useGetIdentity({ retry: false });
            return isPending ? (
                <>Loading</>
            ) : error ? (
                <>{`Error: ${error.message}`}</>
            ) : (
                <>{String(data)}</>
            );
        };
        render(
            <QueryClientProvider client={queryClient}>
                <AuthContext.Provider value={authProvider}>
                    <Identity />
                </AuthContext.Provider>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(authProvider.getIdentity).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['auth', 'getIdentity'],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });
});
