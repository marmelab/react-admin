import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { usePreference } from './usePreference';
import { PreferenceContextProvider } from './PreferenceContextProvider';
import { memoryPreferenceProvider } from './memoryPreferenceProvider';

describe('usePreference', () => {
    it('should return undefined values by default', () => {
        const { result } = renderHook(() => usePreference('foo.bar'));
        expect(result.current[0]).toBeUndefined();
    });

    const Preference = ({ name }) => {
        const [value] = usePreference(name);
        return <>{value}</>;
    };

    it('should return the value from the provider', () => {
        render(
            <PreferenceContextProvider
                value={
                    {
                        getPreference: () => 'hello',
                        setup: () => {},
                        teardown: () => {},
                        subscribe: () => () => {},
                    } as any
                }
            >
                <Preference name="foo.bar" />
            </PreferenceContextProvider>
        );
        screen.getByText('hello');
    });

    it('should subscribe to changes on the key on mount', () => {
        const unsubscribe = jest.fn();
        const subscribe = jest.fn().mockImplementation(() => unsubscribe);
        const { unmount } = render(
            <PreferenceContextProvider
                value={
                    {
                        getPreference: () => 'hello',
                        setup: () => {},
                        teardown: () => {},
                        subscribe,
                    } as any
                }
            >
                <Preference name="foo.bar" />
            </PreferenceContextProvider>
        );
        expect(subscribe).toHaveBeenCalledWith('foo.bar', expect.any(Function));
        unmount();
        expect(unsubscribe).toHaveBeenCalled();
    });

    it('should allow to set values', () => {
        const { result } = renderHook(() => usePreference('foo.bar'));
        result.current[1]('hello');
        expect(result.current[0]).toBe('hello');
    });

    it('should update all components using the same preference on update', () => {
        const UpdatePreference = () => {
            const [_, setValue] = usePreference('foo.bar');
            return <button onClick={() => setValue('world')}>update</button>;
        };
        render(
            <PreferenceContextProvider
                value={memoryPreferenceProvider({ foo: { bar: 'hello' } })}
            >
                <Preference name="foo.bar" />
                <UpdatePreference />
            </PreferenceContextProvider>
        );
        screen.getByText('hello');
        fireEvent.click(screen.getByText('update'));
        screen.getByText('world');
    });
});
