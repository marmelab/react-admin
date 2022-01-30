import * as React from 'react';

import { useStore } from './useStore';

export default {
    title: 'ra-core/store/useStore',
};

const StoreReader = ({ name }) => {
    const [value] = useStore(name);
    return (
        <>
            <dt>{name}</dt>
            <dd>{value}</dd>
        </>
    );
};

const StoreSetter = ({ name }) => {
    const [value, setValue] = useStore(name);
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
            <StoreReader name="foo.bar" />
            <StoreReader name="foo.baz" />
        </dl>
        <h1>Setter</h1>
        <dl>
            <StoreSetter name="foo.bar" />
            <StoreSetter name="foo.baz" />
        </dl>
    </>
);

const StoreRaw = ({ name }) => {
    const [value] = useStore(name);
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

export const MissingValue = () => <StoreRaw name="key_with_no_value" />;

const StoreWithDefault = ({ name, defaultValue }) => {
    const [value] = useStore(name, defaultValue);
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
            <StoreWithDefault name="name1" defaultValue="default" />
            <StoreWithDefault name="name2" defaultValue="default" />
        </dl>
        <h1>Setter</h1>
        <dl>
            <StoreSetter name="name1" />
            <StoreSetter name="name2" />
        </dl>
    </>
);

export const UIStore = () => {
    const [fontSize, setSize] = useStore('ui.size', 16);

    return (
        <>
            <p>Customize the size of the title below</p>
            <input
                type="range"
                min="10"
                max="45"
                value={fontSize}
                onChange={e => setSize(parseInt(e.target.value, 10))}
            />
            <h1 style={{ fontSize }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h1>
        </>
    );
};
