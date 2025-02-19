---
layout: default
title: "useStore"
---

# `useStore`

This hook allows to read and write from the [Store](./Store.md). Stored values are available globally and are persisted between page reloads.

## Syntax

```jsx
import { useStore } from 'react-admin';

const [value, setValue] = useStore(key, defaultValue);
```

The `key` should be a string, and is used for local storage. 

The store can contain values of any type (e.g. `string`, `number`, `boolean`, `array`, `object`), as long as they can be serialized with `JSON.stringify()`. 

The `setValue` function behaves like the one returned by [`useState`](https://react.dev/reference/react/useState), i.e. it accepts both a value or a value updater function.

```jsx
// use setValue with a value
setValue(32);
// use setValue with a value updater function
setValue(v => v + 1);
```

When one component calls `setValue` on a key, all the components that read the same key will update (including on other tabs).

## Example

```jsx
import { List, Datagrid } from 'react-admin';

const PostList = () => {
    const [density] = useStore('posts.list.density', 'small');

    return (
        <List>
            <Datagrid size={density}>
                ...
            </Datagrid>
        </List>
    );
}

// anywhere else in the app
import { useStore } from 'react-admin';
import { Button } from '@mui/material';

const ChangeDensity = () => {
    const [density, setDensity] = useStore('posts.list.density', 'small');

    // Clicking on this button will trigger a rerender of the PostList
    const changeDensity = () => {
        setDensity(density === 'small' ? 'medium' : 'small');
    };

    return (
        <Button onClick={changeDensity}>
            Change density (current {density})
        </Button>
    );
};
```
