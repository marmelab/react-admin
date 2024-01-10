import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { useStore } from './useStore';
import { StoreContextProvider } from './StoreContextProvider';
import { StoreSetter } from './StoreSetter';
import { localStorageStore } from './localStorageStore';

describe('localStorageStore', () => {
    const Store = ({ name }) => {
        const [value] = useStore(name);
        return <>{value}</>;
    };

    it('should return the value from the provider', () => {
        render(
            <StoreContextProvider value={localStorageStore()}>
                <StoreSetter name="foo.bar" value="hello">
                    <Store name="foo.bar" />
                </StoreSetter>
            </StoreContextProvider>
        );
        screen.getByText('hello');
    });

    it('should update all components using the same store item on update', () => {
        const UpdateStore = () => {
            const [, setValue] = useStore('foo.bar');
            return <button onClick={() => setValue('world')}>update</button>;
        };
        render(
            <StoreContextProvider value={localStorageStore()}>
                <StoreSetter name="foo.bar" value="hello">
                    <Store name="foo.bar" />
                    <UpdateStore />
                </StoreSetter>
            </StoreContextProvider>
        );
        screen.getByText('hello');
        fireEvent.click(screen.getByText('update'));
        screen.getByText('world');
    });

    it('should not update components using other store key on update', () => {
        const UpdateStore = () => {
            const [, setValue] = useStore('other.key');
            return <button onClick={() => setValue('world')}>update</button>;
        };
        render(
            <StoreContextProvider value={localStorageStore()}>
                <StoreSetter name="foo.bar" value="hello">
                    <Store name="foo.bar" />
                    <UpdateStore />
                </StoreSetter>
            </StoreContextProvider>
        );
        screen.getByText('hello');
        fireEvent.click(screen.getByText('update'));
        screen.getByText('hello');
    });

    it('should keep two version of the same key on two stores differing bey their appKey', () => {
        const store1 = localStorageStore(undefined, 'app1');
        const store2 = localStorageStore(undefined, 'app2');

        store1.setItem('foo', 'app1');
        store2.setItem('foo', 'app2');

        expect(store1.getItem('foo')).toBe('app1');
        expect(store2.getItem('foo')).toBe('app2');
    });
});
