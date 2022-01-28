import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { usePreference } from './usePreference';
import { PreferenceContextProvider } from './PreferenceContextProvider';
import { PreferenceSetter } from './PreferenceSetter';
import { localStoragePreferenceProvider } from './localStoragePreferenceProvider';

describe('localStoragePreferenceProvider', () => {
    const Preference = ({ name }) => {
        const [value] = usePreference(name);
        return <>{value}</>;
    };

    it('should return the value from the provider', () => {
        render(
            <PreferenceContextProvider value={localStoragePreferenceProvider()}>
                <PreferenceSetter name="foo.bar" value="hello">
                    <Preference name="foo.bar" />
                </PreferenceSetter>
            </PreferenceContextProvider>
        );
        screen.getByText('hello');
    });

    it('should update all components using the same preference on update', () => {
        const UpdatePreference = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, setValue] = usePreference('foo.bar');
            return <button onClick={() => setValue('world')}>update</button>;
        };
        render(
            <PreferenceContextProvider value={localStoragePreferenceProvider()}>
                <PreferenceSetter name="foo.bar" value="hello">
                    <Preference name="foo.bar" />
                    <UpdatePreference />
                </PreferenceSetter>
            </PreferenceContextProvider>
        );
        screen.getByText('hello');
        fireEvent.click(screen.getByText('update'));
        screen.getByText('world');
    });

    it('should not update components using other preference key on update', () => {
        const UpdatePreference = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, setValue] = usePreference('other.key');
            return <button onClick={() => setValue('world')}>update</button>;
        };
        render(
            <PreferenceContextProvider value={localStoragePreferenceProvider()}>
                <PreferenceSetter name="foo.bar" value="hello">
                    <Preference name="foo.bar" />
                    <UpdatePreference />
                </PreferenceSetter>
            </PreferenceContextProvider>
        );
        screen.getByText('hello');
        fireEvent.click(screen.getByText('update'));
        screen.getByText('hello');
    });
});
