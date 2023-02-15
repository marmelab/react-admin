import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useStore } from './useStore';
import { StoreContextProvider } from './StoreContextProvider';
import { memoryStore } from './memoryStore';

describe('useStore', () => {
    it('should return undefined values by default', () => {
        const { result } = renderHook(() => useStore('foo.bar'));
        expect(result.current[0]).toBeUndefined();
    });

    const StoreReader = ({
        name,
        defaultValue,
    }: {
        name: string;
        defaultValue?: any;
    }) => {
        const [value] = useStore(name, defaultValue);
        return <>{value}</>;
    };

    it('should return the value from the provider', () => {
        render(
            <StoreContextProvider
                value={
                    {
                        getItem: () => 'hello',
                        setup: () => {},
                        teardown: () => {},
                        subscribe: () => () => {},
                    } as any
                }
            >
                <StoreReader name="foo.bar" />
            </StoreContextProvider>
        );
        screen.getByText('hello');
    });

    it('should subscribe to changes on the key on mount', () => {
        const unsubscribe = jest.fn();
        const subscribe = jest.fn().mockImplementation(() => unsubscribe);
        const { unmount } = render(
            <StoreContextProvider
                value={
                    {
                        getItem: () => 'hello',
                        setup: () => {},
                        teardown: () => {},
                        subscribe,
                    } as any
                }
            >
                <StoreReader name="foo.bar" />
            </StoreContextProvider>
        );
        expect(subscribe).toHaveBeenCalledWith('foo.bar', expect.any(Function));
        unmount();
        expect(unsubscribe).toHaveBeenCalled();
    });

    it('should allow to set values', () => {
        const { result } = renderHook(() => useStore('foo.bar'));
        result.current[1]('hello');
        expect(result.current[0]).toBe('hello');
    });

    it('should update all components using the same store key on update', () => {
        const UpdateStore = () => {
            const [, setValue] = useStore('foo.bar');
            return <button onClick={() => setValue('world')}>update</button>;
        };
        render(
            <StoreContextProvider
                value={memoryStore({ foo: { bar: 'hello' } })}
            >
                <StoreReader name="foo.bar" />
                <UpdateStore />
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
            <StoreContextProvider
                value={memoryStore({ foo: { bar: 'hello' } })}
            >
                <StoreReader name="foo.bar" />
                <UpdateStore />
            </StoreContextProvider>
        );
        screen.getByText('hello');
        fireEvent.click(screen.getByText('update'));
        screen.getByText('hello');
    });

    it('should accept an updater function as parameter', () => {
        const { result } = renderHook(() => useStore('foo.bar'));
        result.current[1]('hello');
        let innerValue;
        result.current[1](value => {
            innerValue = value;
            return 'world';
        });
        expect(innerValue).toBe('hello');
        expect(result.current[0]).toBe('world');
    });

    it('should clear its value when the key changes', () => {
        const StoreConsumer = ({ storeKey }: { storeKey: string }) => {
            const [value, setValue] = useStore(storeKey);
            return (
                <>
                    <p>{value}</p>
                    <button onClick={() => setValue('hello')}>
                        change value
                    </button>
                </>
            );
        };
        const MyComponent = () => {
            const [storeKey, setStoreKey] = React.useState('list1');
            return (
                <StoreContextProvider value={memoryStore({})}>
                    <StoreConsumer storeKey={storeKey} />
                    <button onClick={() => setStoreKey('list2')}>
                        change key
                    </button>
                </StoreContextProvider>
            );
        };
        render(<MyComponent />);
        expect(screen.queryByText('hello')).toBeNull();
        fireEvent.click(screen.getByText('change value'));
        screen.getByText('hello');
        fireEvent.click(screen.getByText('change key'));
        expect(screen.queryByText('hello')).toBeNull();
    });
});
