import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    SaveContextProvider,
    useMutationMiddlewares,
    useRegisterMutationMiddleware,
} from '../..';

describe('useRegisterMutationMiddleware', () => {
    it('should register and unregister middlewares correctly', async () => {
        const middleware = jest.fn((next: () => void) => next());
        const save = jest.fn();
        const Middleware = () => {
            useRegisterMutationMiddleware(middleware);
            return null;
        };
        const Parent = () => {
            const [mount, setMount] = React.useState(true);
            const middlewaresFunctions = useMutationMiddlewares();

            return (
                <SaveContextProvider value={middlewaresFunctions}>
                    {mount && <Middleware />}
                    <button onClick={() => setMount(!mount)}>
                        Toggle middleware
                    </button>
                    <button
                        onClick={() => {
                            const saveWithMiddlewares =
                                middlewaresFunctions.getMutateWithMiddlewares(
                                    save
                                );
                            saveWithMiddlewares();
                        }}
                    >
                        Save
                    </button>
                </SaveContextProvider>
            );
        };

        render(<Parent />);
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(save).toHaveBeenCalledTimes(1);
        });
        expect(middleware).toHaveBeenCalledTimes(1);
        save.mockClear();
        middleware.mockClear();
        fireEvent.click(screen.getByText('Toggle middleware'));
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(save).toHaveBeenCalledTimes(1);
        });
        expect(middleware).not.toHaveBeenCalled();
    });

    it('should execute middlewares registered even if they have been unregistered as an optimistic side effect', async () => {
        const middleware = jest.fn((next: () => void) => next());
        const save = jest.fn();
        const Middleware = () => {
            useRegisterMutationMiddleware(middleware);
            return <span>Middleware</span>;
        };
        const Parent = () => {
            const [mount, setMount] = React.useState(true);
            const middlewaresFunctions = useMutationMiddlewares();

            return (
                <SaveContextProvider value={middlewaresFunctions}>
                    {mount && <Middleware />}
                    <button
                        onClick={() => {
                            const saveWithMiddlewares =
                                middlewaresFunctions.getMutateWithMiddlewares(
                                    save
                                );
                            // Mimic optimistic side effect such as redirect which would unregister the middleware
                            setMount(false);
                            setTimeout(() => {
                                saveWithMiddlewares();
                            }, 250);
                        }}
                    >
                        Save
                    </button>
                </SaveContextProvider>
            );
        };

        render(<Parent />);
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(screen.queryByText('Middleware')).toBeNull();
            expect(save).not.toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(save).toHaveBeenCalledTimes(1);
        });
        expect(middleware).toHaveBeenCalledTimes(1);
    });
});
