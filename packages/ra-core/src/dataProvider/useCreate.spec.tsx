import * as React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import expect from 'expect';

import { RaRecord } from '../types';
import { testDataProvider } from './testDataProvider';
import { useCreate } from './useCreate';
import { useGetList } from './useGetList';
import { CoreAdminContext } from '../core';
import {
    WithMiddlewaresError,
    WithMiddlewaresSuccess,
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

    it('accepts a meta paramater', async () => {
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

    describe('middlewares', () => {
        it('it accepts middlewares and displays result and success side effects when dataProvider promise resolves', async () => {
            render(<WithMiddlewaresSuccess timeout={10} />);
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

        it('it accepts middlewares and displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<WithMiddlewaresError timeout={10} />);
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
    });
});
