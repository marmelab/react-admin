import * as React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import expect from 'expect';
import { QueryClient, useMutationState } from '@tanstack/react-query';

import { RaRecord } from '../types';
import { testDataProvider } from './testDataProvider';
import { useCreate } from './useCreate';
import { useGetList } from './useGetList';
import { CoreAdminContext } from '../core';
import {
    ErrorCase as ErrorCasePessimistic,
    SuccessCase as SuccessCasePessimistic,
    WithMiddlewaresSuccess as WithMiddlewaresSuccessPessimistic,
    WithMiddlewaresError as WithMiddlewaresErrorPessimistic,
} from './useCreate.pessimistic.stories';
import {
    ErrorCase as ErrorCaseOptimistic,
    SuccessCase as SuccessCaseOptimistic,
    WithMiddlewaresSuccess as WithMiddlewaresSuccessOptimistic,
    WithMiddlewaresError as WithMiddlewaresErrorOptimistic,
} from './useCreate.optimistic.stories';
import {
    ErrorCase as ErrorCaseUndoable,
    SuccessCase as SuccessCaseUndoable,
    WithMiddlewaresSuccess as WithMiddlewaresSuccessUndoable,
    WithMiddlewaresError as WithMiddlewaresErrorUndoable,
} from './useCreate.undoable.stories';
import {
    Middleware,
    MutationMode,
    Params,
    InvalidateList,
} from './useCreate.stories';

describe('useCreate', () => {
    it('returns a callback that can be used with create arguments', async () => {
        const dataProvider = testDataProvider({
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        });
        let localCreate;
        const Dummy = () => {
            const [create] = useCreate();
            localCreate = create;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localCreate('foo', { data: { bar: 'baz' } });
        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('foo', {
                data: { bar: 'baz' },
            });
        });
    });

    it('returns a callback that can be used with no arguments', async () => {
        const dataProvider = testDataProvider({
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        });
        let localCreate;
        const Dummy = () => {
            const [create] = useCreate('foo', { data: { bar: 'baz' } });
            localCreate = create;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localCreate();
        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('foo', {
                data: { bar: 'baz' },
            });
        });
    });

    it('uses the latest declaration time mutationMode', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        // This story uses the pessimistic mode by default
        render(<MutationMode />);
        fireEvent.click(screen.getByText('Change mutation mode to optimistic'));
        fireEvent.click(screen.getByText('Create post'));
        // Should display the optimistic result right away if the change was handled
        await waitFor(() => {
            expect(screen.queryByText('success')).not.toBeNull();
            expect(screen.queryByText('Hello World')).not.toBeNull();
            expect(screen.queryByText('mutating')).not.toBeNull();
        });
        await waitFor(() => {
            expect(screen.queryByText('mutating')).toBeNull();
        });
        expect(screen.queryByText('success')).not.toBeNull();
        expect(screen.queryByText('Hello World')).not.toBeNull();
    });

    it('uses the latest declaration time params', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        // This story sends the Hello World title by default
        render(<Params />);
        fireEvent.click(screen.getByText('Change params'));
        fireEvent.click(screen.getByText('Create post'));
        // Should have changed the title to Goodbye World
        await waitFor(() => {
            expect(screen.queryByText('success')).not.toBeNull();
            expect(screen.queryByText('Goodbye World')).not.toBeNull();
            expect(screen.queryByText('mutating')).not.toBeNull();
        });
        await waitFor(() => {
            expect(screen.queryByText('mutating')).toBeNull();
        });
        expect(screen.queryByText('success')).not.toBeNull();
        expect(screen.queryByText('Goodbye World')).not.toBeNull();
    });

    it('uses call time params over hook time params', async () => {
        const dataProvider = testDataProvider({
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        });
        let localCreate;
        const Dummy = () => {
            const [create] = useCreate('foo', { data: { bar: 'baz' } });
            localCreate = create;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localCreate('foo', { data: { foo: 456 } });
        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('foo', {
                data: { foo: 456 },
            });
        });
    });

    it('accepts a meta parameter', async () => {
        const dataProvider = testDataProvider({
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        });
        let localCreate;
        const Dummy = () => {
            const [create] = useCreate();
            localCreate = create;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localCreate('foo', { data: { bar: 'baz' }, meta: { hello: 'world' } });
        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('foo', {
                data: { bar: 'baz' },
                meta: { hello: 'world' },
            });
        });
    });

    it('sets the mutationKey', async () => {
        const queryClient = new QueryClient();
        queryClient.setMutationDefaults(['foo', 'create'], {
            meta: { hello: 'world' },
        });

        const dataProvider = testDataProvider({
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        });
        let localCreate;
        const Dummy = () => {
            const [create] = useCreate('foo');
            localCreate = create;
            return <span />;
        };
        const Observe = () => {
            const mutation = useMutationState({
                filters: {
                    mutationKey: ['foo', 'create'],
                },
            });

            return <span>mutations: {mutation.length}</span>;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
                <Observe />
            </CoreAdminContext>
        );
        localCreate('foo', { data: { bar: 'baz' }, meta: { hello: 'world' } });
        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('foo', {
                data: { bar: 'baz' },
                meta: { hello: 'world' },
            });
        });
        await screen.findByText('mutations: 1');
    });

    it('returns a state typed based on the parametric type', async () => {
        interface Product extends RaRecord {
            sku: string;
        }
        const dataProvider = testDataProvider({
            create: jest.fn(() =>
                Promise.resolve({ data: { id: 1, sku: 'abc' } } as any)
            ),
        });
        let localCreate;
        let sku;
        const Dummy = () => {
            const [create, { data }] = useCreate<Product>();
            localCreate = create;
            sku = data && data.sku;
            return <span />;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        expect(sku).toBeUndefined();
        localCreate('products', { data: { sku: 'abc' } });
        await waitFor(() => {
            expect(sku).toEqual('abc');
        });
    });

    it('invalidates the getList cache', async () => {
        const products = [
            { id: 1, sku: 'abc' },
            { id: 2, sku: 'def' },
        ];
        const dataProvider = testDataProvider({
            getList: () =>
                Promise.resolve({
                    data: products as any,
                    total: products.length,
                }),
            create: () => {
                const newProduct = { id: 3, sku: 'ghi' };
                products.push(newProduct);
                return Promise.resolve({ data: newProduct as any });
            },
        });
        const ProductPage = () => {
            const { data: products, isPending } = useGetList('products');
            if (isPending) return null;
            return (
                <ul>
                    {products?.map(product => (
                        <li key={product.id}>{product.sku}</li>
                    ))}
                    <li>
                        <AddProductButton />
                    </li>
                </ul>
            );
        };
        const AddProductButton = () => {
            const [create] = useCreate('products', { data: { sku: 'ghi' } });
            return <button onClick={() => create()}>Create</button>;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ProductPage />
            </CoreAdminContext>
        );
        const createButton = await screen.findByText('Create');
        createButton.click();
        await waitFor(() => {
            expect(screen.queryByText('ghi')).not.toBeNull();
        });
    });

    describe('mutationMode', () => {
        it('when pessimistic, displays result and success side effects when dataProvider promise resolves', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<SuccessCasePessimistic timeout={10} />);
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when pessimistic, displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<ErrorCasePessimistic timeout={10} />);
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(screen.queryByText('something went wrong')).toBeNull();
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('something went wrong')
                ).not.toBeNull();
                expect(screen.queryByText('nothing yet')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when optimistic, displays result and success side effects right away', async () => {
            render(<SuccessCaseOptimistic timeout={50} />);
            await screen.findByText('nothing yet');
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when optimistic, displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<ErrorCaseOptimistic timeout={10} />);
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('something went wrong')
                ).not.toBeNull();
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            await screen.findByText('nothing yet');
        });
        it('when undoable, displays result and success side effects right away and fetched on confirm', async () => {
            render(<SuccessCaseUndoable timeout={10} />);
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Confirm').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(
                () => {
                    expect(screen.queryByText('mutating')).toBeNull();
                },
                { timeout: 4000 }
            );
            expect(screen.queryByText('success')).not.toBeNull();
            expect(screen.queryByText('Hello World')).not.toBeNull();
        });
        it('when undoable, displays result and success side effects right away and reverts on cancel', async () => {
            render(<SuccessCaseUndoable timeout={10} />);
            await screen.findByText('nothing yet');
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Cancel').click();
            await waitFor(() => {
                expect(screen.queryByText('Hello World')).toBeNull();
            });
            expect(screen.queryByText('mutating')).toBeNull();
            await screen.findByText('nothing yet');
        });
        it('when undoable, displays result and success side effects right away and reverts on error', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<ErrorCaseUndoable />);
            await screen.findByText('nothing yet', undefined, {
                timeout: 5000,
            });
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Confirm').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await screen.findByText('nothing yet', undefined, {
                timeout: 4000,
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
    });

    describe('middlewares', () => {
        it('when pessimistic, it accepts middlewares and displays result and success side effects when dataProvider promise resolves', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<WithMiddlewaresSuccessPessimistic timeout={10} />);
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });

        it('when pessimistic, it accepts middlewares and displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<WithMiddlewaresErrorPessimistic timeout={10} />);
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(screen.queryByText('something went wrong')).toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('something went wrong')
                ).not.toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });

        it('when optimistic, it accepts middlewares and displays result and success side effects right away', async () => {
            render(<WithMiddlewaresSuccessOptimistic timeout={10} />);
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when optimistic, it accepts middlewares and displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<WithMiddlewaresErrorOptimistic timeout={10} />);
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('something went wrong')
                ).not.toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            await screen.findByText('nothing yet');
        });

        it('when undoable, it accepts middlewares and displays result and success side effects right away and fetched on confirm', async () => {
            render(<WithMiddlewaresSuccessUndoable timeout={10} />);
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Confirm').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(
                () => {
                    expect(screen.queryByText('mutating')).toBeNull();
                },
                { timeout: 4000 }
            );
            expect(screen.queryByText('success')).not.toBeNull();
            await screen.findByText('Hello World from middleware');
        });
        it('when undoable, it accepts middlewares and displays result and success side effects right away and reverts on cancel', async () => {
            render(<WithMiddlewaresSuccessUndoable timeout={10} />);
            await screen.findByText('nothing yet');
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Cancel').click();
            await waitFor(() => {
                expect(screen.queryByText('Hello World')).toBeNull();
            });
            expect(screen.queryByText('mutating')).toBeNull();
            await screen.findByText('nothing yet');
        });
        it('when undoable, it accepts middlewares and displays result and success side effects right away and reverts on error', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<WithMiddlewaresErrorUndoable />);
            await screen.findByText('nothing yet', undefined, {
                timeout: 5000,
            });
            screen.getByText('Create post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Confirm').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await screen.findByText('Hello World', undefined, {
                timeout: 4000,
            });
            await waitFor(
                () => {
                    expect(screen.queryByText('success')).toBeNull();
                },
                { timeout: 5000 }
            );

            expect(
                screen.queryByText('Hello World from middleware')
            ).toBeNull();
            expect(screen.queryByText('mutating')).toBeNull();
        }, 6000);

        it(`it calls the middlewares in undoable mode even when they got unregistered`, async () => {
            const middlewareSpy = jest.fn();
            render(
                <Middleware
                    mutationMode="undoable"
                    timeout={0}
                    middleware={middlewareSpy}
                />
            );

            fireEvent.change(screen.getByLabelText('title'), {
                target: { value: 'Bazinga' },
            });
            fireEvent.click(screen.getByText('Save'));
            await screen.findByText('resources.posts.notifications.created');
            expect(middlewareSpy).not.toHaveBeenCalled();
            fireEvent.click(screen.getByText('Refresh'));
            expect(screen.queryByText('Bazinga')).toBeNull();
            fireEvent.click(screen.getByText('Close'));
            await waitFor(() => {
                expect(middlewareSpy).toHaveBeenCalledWith('posts', {
                    data: { id: 2, title: 'Bazinga' },
                    meta: undefined,
                });
            });
            fireEvent.click(screen.getByText('Refresh'));
            await screen.findByText('Bazinga');
        });
        it(`it calls the middlewares in optimistic mode even when they got unregistered`, async () => {
            const middlewareSpy = jest.fn();
            render(
                <Middleware
                    mutationMode="optimistic"
                    timeout={0}
                    middleware={middlewareSpy}
                />
            );

            fireEvent.change(screen.getByLabelText('title'), {
                target: { value: 'Bazinga' },
            });
            fireEvent.click(screen.getByText('Save'));
            await screen.findByText('resources.posts.notifications.created');
            fireEvent.click(screen.getByText('Close'));
            expect(middlewareSpy).toHaveBeenCalledWith('posts', {
                data: { id: 2, title: 'Bazinga' },
                meta: undefined,
            });
            fireEvent.click(screen.getByText('Refresh'));
            await screen.findByText('Bazinga');
        });
    });

    it('invalidates getList query when dataProvider resolves in undoable mode', async () => {
        render(<InvalidateList mutationMode="undoable" />);
        fireEvent.change(await screen.findByLabelText('title'), {
            target: { value: 'New Post' },
        });
        fireEvent.click(screen.getByText('Save'));
        await screen.findByText('resources.posts.notifications.created');
        fireEvent.click(screen.getByText('Close'));
        await screen.findByText('3: New Post');
    });
});
