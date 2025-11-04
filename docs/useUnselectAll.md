---
layout: default
title: "useUnselectAll"
---

# `useUnselectAll`

This hook returns a function that unselects all lines in a `<DataTable>`.

## Usage

```jsx
import { useListContext, useUnselectAll } from 'react-admin';

const UnselectAllButton = () => {
    const { resource } = useListContext();
    const unselectAll = useUnselectAll(resource);

    const handleClick = () => {
        unselectAll();
    };

    return <button onClick={handleClick}>Unselect all</button>;
};
```

## Parameters

`useUnselectAll` accepts two parameters. Both are optional:

- [`resource`](#resource): The resource name. If not specified, the hook will only update the locally stored selection state (changes are not persisted in the Store).
- [`storeKey`](#storekey): The store key to use. If not specified, the hook will derive the store key from the `resource`. It should match with the `storeKey` used in the parent `<List>`.

## `resource`

Use `resource` to specify the resource name.

```jsx
import { useListContext, useUnselectAll } from 'react-admin';

const UnselectAllButton = () => {
    const { resource } = useListContext();
    const unselectAll = useUnselectAll(resource);

    const handleClick = () => {
        unselectAll();
    };

    return <button onClick={handleClick}>Unselect all</button>;
};
```

If not specified, the hook will only update the locally stored selection state (changes are not persisted in the Store). This is notably useful when the parent `<List>` has the [`storeKey`](./List.md#storekey) prop set to `false`.

```jsx
import { useListContext, useUnselectAll } from 'react-admin';

const UnselectAllButton = () => {
    // Call useUnselectAll without arguments - local selection only
    const unselectAll = useUnselectAll();

    const handleClick = () => {
        unselectAll();
    };

    return <button onClick={handleClick}>Unselect all</button>;
};
```

## `storeKey`

The default store key is derived from the resource name: `${resource}.selectedIds`.

You can customize the store key used by passing a `storeKey` parameter to the hook. Make sure it matches the `storeKey` used in the parent `<List>`.

The final store key used will be `${storeKey}.selectedIds`.

```jsx
import { useListContext, useUnselectAll } from 'react-admin';

const UnselectAllButton = () => {
    const { resource } = useListContext();
    const unselectAll = useUnselectAll(resource, 'customStoreKey');

    const handleClick = () => {
        unselectAll();
    };

    return <button onClick={handleClick}>Unselect all</button>;
};
```

## Return value

`useUnselectAll` returns a function taking one optional parameter:

- `fromAllStoreKeys`: A boolean indicating whether to unselect the records across all storeKeys used with this resource. Defaults to `false`. Set this to `true` for instance when the records are deleted, to ensure they don't remain selected in other lists.

```jsx
import { useListContext, useUnselectAll } from 'react-admin';

const UnselectAllButton = () => {
    const { resource } = useListContext();
    const unselectAll = useUnselectAll(resource);

    const handleClick = () => {
        // Unselect across all store keys
        unselectAll(true);
    };

    return <button onClick={handleClick}>Unselect all</button>;
};
```

