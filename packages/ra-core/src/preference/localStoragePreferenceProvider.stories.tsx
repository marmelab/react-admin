import * as React from 'react';

import { localStoragePreferenceProvider } from './localStoragePreferenceProvider';
import { PreferenceContextProvider } from './PreferenceContextProvider';
import { usePreference } from './usePreference';

export default {
    title: 'ra-core/preference/localStorage',
};

const Preference = ({ name }) => {
    const [value] = usePreference(name);
    return (
        <>
            <dt>{name}</dt>
            <dd>{value}</dd>
        </>
    );
};

const PreferenceSetter = ({ name }) => {
    const [value, setValue] = usePreference<string>(name);
    return (
        <>
            <dt>{name}</dt>
            <dd>
                <input
                    type="text"
                    value={value}
                    onChange={e =>
                        setValue(
                            e.target.value === '' ? undefined : e.target.value
                        )
                    }
                />
            </dd>
        </>
    );
};

export const Basic = () => {
    return (
        <PreferenceContextProvider value={localStoragePreferenceProvider()}>
            <h1>Values</h1>
            <dl>
                <Preference name="foo.bar" />
                <Preference name="foo.baz" />
            </dl>
            <h1>Setter</h1>
            <dl>
                <PreferenceSetter name="foo.bar" />
                <PreferenceSetter name="foo.baz" />
            </dl>
        </PreferenceContextProvider>
    );
};
