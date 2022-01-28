import * as React from 'react';

import { usePreference } from './usePreference';

export default {
    title: 'ra-core/preference/usePreference',
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
    const [value, setValue] = usePreference(name);
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

export const Basic = () => (
    <>
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
    </>
);

const PreferenceRaw = ({ name }) => {
    const [value] = usePreference(name);
    return (
        <>
            {value === undefined
                ? 'undefined'
                : value === null
                ? 'null'
                : value === ''
                ? "''"
                : value}
        </>
    );
};

export const MissingValue = () => <PreferenceRaw name="key_with_no_value" />;

const PreferenceWithDefault = ({ name, defaultValue }) => {
    const [value] = usePreference(name, defaultValue);
    return (
        <>
            <dt>{name}</dt>
            <dd>{value}</dd>
        </>
    );
};

export const DefaultValue = () => (
    <>
        <h1>Values</h1>
        <dl>
            <PreferenceWithDefault name="name1" defaultValue="default" />
            <PreferenceWithDefault name="name2" defaultValue="default" />
        </dl>
        <h1>Setter</h1>
        <dl>
            <PreferenceSetter name="name1" />
            <PreferenceSetter name="name2" />
        </dl>
    </>
);
