---
layout: default
title: "The Store"
---

# The Store

React-admin contains a global, synchronous, persistent store for storing user preferences. Think of the Store as a key-value database that persists between page loads.

Users expect that UI choices, like changing the interface language or theme, should only be made once. Let's call these choices "preferences". The react-admin Store is the perfect place to store preferenes.

The store uses the browser local storage (or a memory storage when `localStorage` isn't available). The store is emptied when the user logs out.

It requires no setup, and is available via [the `useStore` hook](./useStore.md). 

## Usage

React-admin provides the following hooks to interact with the Store: 

* [`useStore`](./useStore.md)
* [`useRemoveFromStore`](./useRemoveFromStore.md)
* [`useResetStore`](./useResetStore.md)
* [`useStoreContext`](./useStoreContext.md)

For instance, here is how to use it to show or hide a help panel:

```jsx
const HelpButton = () => {
    const [helpOpen, setHelpOpen] = useStore('help.open', false);
    return (
        <>
            <Button onClick={() => setHelpOpen(v => !v)}>
                {helpOpen ? 'Hide' : 'Show'} help
            </Button>
            <Popover open={helpOpen} onClose={() => setHelpOpen(false)}>
                French
            </Popover>
        </>
    );
};
```

## Store-Based Hooks

React-admin components don't acess the store directly ; instead, they use purpose-driven hooks, which you can use, too:

- `useSidebarState()` for the open/closed sidebar state
- `useLocaleState()` for the locale
- `useTheme()` for the theme
- `useUnselect()`, `useUnselectAll()`, `useRecordSelection()` for the selected records for a resource
- `useExpanded()` for the expanded rows in a datagrid

Using specialized hooks avoids depending on a store key.

## Transient Store

If you don't want the store to be persisted between sessions, you can override the default `<Admin store>` component:

```jsx
import { Admin, Resource, memoryStore } from 'react-admin';

const App = () => (
    <Admin dataProvider={dataProvider} store={memoryStore()}>
        <Resource name="posts" />
    </Admin>
);
```

This way, each time the application is loaded, the store will be reset to an empty state.

## Testing Components Using The Store

The react-admin Store is persistent. This means that if a unit test modifies an item in the store, the value will be changed for the next test. This will cause random test failures when you use `useStore()` in your tests, or any feature depending on the store (e.g. datagrid row selection, sidebar state, language selection).

To isolate you unit tests, pass a new `memoryContext` for each test:

```jsx
import { memoryStore } from 'react-admin';

test('<MyComponent>', async () => {
    const { getByText } = render(
        <AdminContext store={memoryContext()}>
            <MyComponent />
        </AdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```

If you don't need `<AdminContext>`, you can just wrap your component with a `<StoreContextProvider>`:

```jsx
import { StoreContextProvider, memoryStore } from 'react-admin';

test('<MyComponent>', async () => {
    const { getByText } = render(
        <StoreContextProvider value={memoryContext()}>
            <MyComponent />
        </StoreContextProvider>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```
