---
layout: default
title: "Preferences"
---

# Preferences

React-admin contains a global, synchronous, persistent store for storing user preferences. Think of the Store as a key-value database that persists between page loads.

Users expect that UI choices, like changing the interface language or theme, should only be made once. Let's call these choices "preferences". The react-admin Store is the perfect place to store preferences.

The store uses the browser local storage (or a memory storage when `localStorage` isn't available). The store is emptied when the user logs out.

It requires no setup, and is available via [the `useStore` hook](./useStore.md). 

## Usage

React-admin provides the following hooks to interact with the Store: 

* [`useStore`](./useStore.md)
* [`useRemoveFromStore`](./useRemoveFromStore.md)
* [`useResetStore`](./useResetStore.md)
* [`useStoreContext`](./useStoreContext.md)

Some react-admin components use the Store internally:

* [`<ToggleThemeButton>`](./ToggleThemeButton.md)
* [`<LocalesMenuButton>`](./LocalesMenuButton.md)

For instance, here is how to use it to show or hide a help panel:

```jsx
import { useStore } from 'react-admin';
import { Button, Popover } from '@mui/material';

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

React-admin components don't access the store directly ; instead, they use purpose-driven hooks, which you can use, too:

- `useSidebarState()` for the open/closed sidebar state
- `useLocaleState()` for the locale
- [`useTheme()`](./useTheme.md) for the theme
- `useUnselect()`, `useUnselectAll()`, `useRecordSelection()` for the selected records for a resource
- `useExpanded()` for the expanded rows in a datagrid

Using specialized hooks avoids depending on a store key.

## Forward Compatibility

If you store complex objects in the Store, and you change the structure of these objects in the application code, the new code relying on the new object structure may fail when running with an old stored object.

For instance, let's imagine an app storing a User Preferences object in the Store under the `'preferences'` key. The object looks like:

```jsx
{ fontSize: 'large', colorScheme: 'dark' }
```

Then, the developer changes the structure of the object:

```jsx
{
    ui: {
        fontSize: 'large',
        mode: 'dark',
    }
}
```

The new code reads the preferences from the Store and expects the value to respect the new structure:

```jsx
const preferences = useStore('preferences');
// this will throw an error if a user has an old preferences object
const { fontSize, mode } = preferences.ui;
```

To avoid this type of error, the code using the Store should always make sure that the object from the Store has the expected structure, and use a default value if not. To put it otherwise, always assume that the data from the store may have the wrong shape - it's the only way to ensure forward compatibility.

```jsx
let preferences = useStore('preferences');
if (!preferences.ui || !preferences.ui.fontSize || !preferences.ui.mode) {
    preferences = { ui: { fontSize: 'large', mode: 'dark' } };
}
// this will never fail
const { fontSize, mode } = preferences.ui;
```

You may want to use libraries that validate the schema of an object, like [Yup](https://github.com/jquense/yup), [Zod](https://github.com/vriad/zod), [Superstruct](https://github.com/ianstormtaylor/superstruct), or [Joi](https://github.com/hapijs/joi).

Even better: don't store objects in the Store at all, only store scalar values instead. You can call `useStore` several times:

```jsx
let fontSize = useStore('preferences.ui.fontSize');
let mode = useStore('preferences.ui.mode');
```

## Store Invalidation

If your application cannot check the shape of a stored object, react-admin provides an escape hatch to avoid errors for users with an old value: store invalidation. 

The idea is that you can specify a version number for your Store. If the Store contains data with a different version number than the code, the Store resets all preferences.

To create a Store with a different version number, call the `localStorageStore()` function with a version identifier, then pass the resulting object as the `<Admin store>` prop:

```jsx
import { Admin, Resource, localStorageStore } from 'react-admin';

const STORE_VERSION = "2";

const App = () => (
    <Admin dataProvider={dataProvider} store={localStorageStore(STORE_VERSION)}>
        <Resource name="posts" />
    </Admin>
);
```

Increase the version number each time you push code that isn't compatible with the stored values. 

## Share/separate Store data between same domain instances

If you are running multiple instances of react-admin on the same domain, you can distinguish their stored objects by defining different application keys. By default, the application key is empty to allow configuration sharing between instances.

```jsx
import { Admin, Resource, localStorageStore } from 'react-admin';

const APP_KEY = 'blog';

const App = () => (
    <Admin dataProvider={dataProvider} store={localStorageStore(undefined, APP_KEY)}>
        <Resource name="posts" />
    </Admin>
);
```


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

To isolate your unit tests, pass a new `memoryStore` for each test:

```jsx
import { AdminContext, memoryStore } from 'react-admin';

test('<MyComponent>', async () => {
    const { getByText } = render(
        <AdminContext store={memoryStore()}>
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
        <StoreContextProvider value={memoryStore()}>
            <MyComponent />
        </StoreContextProvider>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```
