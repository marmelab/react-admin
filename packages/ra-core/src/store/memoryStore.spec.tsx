import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { memoryStore } from './memoryStore';
import { useStore } from './useStore';
import { StoreContextProvider } from './StoreContextProvider';

describe('memoryStore', () => {
    it('should allow to store and retrieve a value', () => {
        const store = memoryStore();
        store.setup();
        store.setItem('foo', 'bar');
        expect(store.getItem('foo')).toEqual('bar');
    });
    describe('removeItem', () => {
        it('should remove an item', () => {
            const store = memoryStore();
            store.setup();
            store.setItem('foo', 'bar');
            store.setItem('hello', 'world');
            store.removeItem('foo');
            expect(store.getItem('foo')).toEqual(undefined);
            expect(store.getItem('hello')).toEqual('world');
        });
    });
    describe('removeItems', () => {
        it('should remove all items with the given prefix', () => {
            const store = memoryStore();
            store.setup();
            store.setItem('foo', 'bar');
            store.setItem('foo2', 'bar2');
            store.setItem('foo3', 'bar3');
            store.setItem('hello', 'world');
            store.removeItems('foo');
            expect(store.getItem('foo')).toEqual(undefined);
            expect(store.getItem('foo2')).toEqual(undefined);
            expect(store.getItem('foo3')).toEqual(undefined);
            expect(store.getItem('hello')).toEqual('world');
        });
    });
    describe('reset', () => {
        it('should reset the store', () => {
            const store = memoryStore();
            store.setup();
            store.setItem('foo', 'bar');
            store.reset();
            expect(store.getItem('foo')).toEqual(undefined);
        });
    });

    describe('nested-looking keys', () => {
        it('should store and retrieve values in keys that appear nested without overriding content', () => {
            const store = memoryStore();
            store.setup();
            store.setItem('foo', 'parent value');
            store.setItem('foo.bar', 'nested value');

            expect(store.getItem('foo')).toEqual('parent value');
            expect(store.getItem('foo.bar')).toEqual('nested value');
        });

        it('should handle initial storage with nested objects', () => {
            const initialStorage = {
                user: {
                    name: 'John',
                },
                'user.settings': {
                    theme: 'dark',
                },
            };

            const store = memoryStore(initialStorage);
            store.setup();

            expect(store.getItem('user')).toEqual({ name: 'John' });
            expect(store.getItem('user.settings')).toEqual({ theme: 'dark' });
        });
    });

    it('preserves the initial value in StrictMode', async () => {
        const Component = () => {
            const [value] = useStore('user', 'Not me');
            return <>{value}</>;
        };

        render(
            <React.StrictMode>
                <StoreContextProvider value={memoryStore({ user: 'John' })}>
                    <Component />
                </StoreContextProvider>
            </React.StrictMode>
        );

        await screen.findByText('John');
    });
});
