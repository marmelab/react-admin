import * as React from 'react';

import { memoryStore } from './memoryStore';
import { StoreContextProvider } from './StoreContextProvider';
import { useStore } from './useStore';

export default {
    title: 'ra-core/store/memory',
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

export const Basic = () => {
    return (
        <StoreContextProvider value={memoryStore()}>
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
        </StoreContextProvider>
    );
};
