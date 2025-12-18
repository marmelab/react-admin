import * as React from 'react';

import { localStorageStore } from './localStorageStore';
import { StoreContextProvider } from './StoreContextProvider';
import { useStore } from './useStore';
import { useStoreContext } from './useStoreContext';

export default {
    title: 'ra-core/store/localStorage',
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
    const [value, setValue] = useStore<string>(name);
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
        <StoreContextProvider value={localStorageStore()}>
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

const StoreList = () => {
    const store = useStoreContext();
    const [items, setItems] = React.useState({});
    return (
        <>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    type="button"
                    onClick={() => setItems(store.listItems())}
                >
                    Get all items
                </button>
                <button
                    type="button"
                    onClick={() => setItems(store.listItems('foo.'))}
                >
                    Get items with prefix
                </button>
            </div>
            <pre>{JSON.stringify(items, null, 2)}</pre>
        </>
    );
};
export const ListItems = () => {
    return (
        <StoreContextProvider value={localStorageStore()}>
            <h1>Values</h1>
            <dl>
                <StoreReader name="foo.bar" />
                <StoreReader name="foo.baz" />
                <StoreReader name="bar.baz" />
            </dl>
            <h1>Setter</h1>
            <dl>
                <StoreSetter name="foo.bar" />
                <StoreSetter name="foo.baz" />
                <StoreSetter name="bar.baz" />
            </dl>
            <StoreList />
        </StoreContextProvider>
    );
};
