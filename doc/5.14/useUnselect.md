---
layout: default
title: "useUnselect"
---

# `useUnselect`

This hook returns a function that unselects lines in a `<DataTable>` that match an array of ids.

## Usage

```jsx
import { useListContext, useUnselect } from 'react-admin';

const UnselectButton = () => {
    const { resource, selectedIds } = useListContext();
    const unselect = useUnselect(resource);

    const handleClick = () => {
        unselect(selectedIds);
    };

    return (
        <button onClick={handleClick}>
            {`Unselect ${selectedIds.length} records`}
        </button>
    );
};
```

## Parameters

`useUnselect` accepts two parameters. Both are optional:

- [`resource`](#resource): The resource name. If not specified, the hook will only update the locally stored selection state (changes are not persisted in the Store).
- [`storeKey`](#storekey): The store key to use. If not specified, the hook will derive the store key from the `resource`. It should match with the `storeKey` used in the parent `<List>`.

## `resource`

Use `resource` to specify the resource name.

```jsx
import { useListContext, useUnselect } from 'react-admin';

const UnselectButton = () => {
    const { resource, selectedIds } = useListContext();
    const unselect = useUnselect(resource);

    const handleClick = () => {
        unselect(selectedIds);
    };

    return (
        <button onClick={handleClick}>
            {`Unselect ${selectedIds.length} records`}
        </button>
    );
};
```

If not specified, the hook will only update the locally stored selection state (changes are not persisted in the Store). This is notably useful when the parent `<List>` has the [`storeKey`](./List.md#storekey) prop set to `false`.

```jsx
import { useListContext, useUnselect } from 'react-admin';

const UnselectButton = () => {
    const { selectedIds } = useListContext();
    // Call useUnselect without arguments - local selection only
    const unselect = useUnselect();

    const handleClick = () => {
        unselect(selectedIds);
    };

    return (
        <button onClick={handleClick}>
            {`Unselect ${selectedIds.length} records`}
        </button>
    );
};
```

## `storeKey`

The default store key is derived from the resource name: `${resource}.selectedIds`.

You can customize the store key used by passing a `storeKey` parameter to the hook. Make sure it matches the `storeKey` used in the parent `<List>`.

The final store key used will be `${storeKey}.selectedIds`.

```jsx
import { useListContext, useUnselect } from 'react-admin';

const UnselectButton = () => {
    const { resource, selectedIds } = useListContext();
    const unselect = useUnselect(resource, 'customStoreKey');

    const handleClick = () => {
        unselect(selectedIds);
    };

    return (
        <button onClick={handleClick}>
            {`Unselect ${selectedIds.length} records`}
        </button>
    );
};
```

## Return value

`useUnselect` returns a function taking up to two parameters:

- `ids`: An array of record ids to unselect.
- `fromAllStoreKeys`: A boolean indicating whether to unselect the records across all storeKeys used with this resource. Defaults to `false`. Set this to `true` for instance when the records are deleted, to ensure they don't remain selected in other lists.

```jsx
import { useListContext, useUnselect } from 'react-admin';

const UnselectButton = () => {
    const { resource, selectedIds } = useListContext();
    const unselect = useUnselect(resource);

    const handleClick = () => {
        // Unselect across all store keys
        unselect(selectedIds, true);
    };

    return (
        <button onClick={handleClick}>
            {`Unselect ${selectedIds.length} records`}
        </button>
    );
};
```

