---
layout: default
title: "useStore"
---

# `useStore`

This hook allows to read and write from the [Store](./Store.md). Stored values are available globally and are persisted between page reloads.

## Syntax

```jsx
import { useStore } from 'react-admin';

const [value, setValue] = useStore(key, defaultValue, validate);
```

The `key` should be a string, and is used for local storage. 

The store can contain values of any type (e.g. `string`, `number`, `boolean`, `array`, `object`), as long as they can be serialized with `JSON.stringify()`. 

The `setValue` function behaves like the one returned by [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate), i.e. it accepts both a value or a value updater function.

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

const PostList = props => {
    const [density] = useStore('posts.list.density', 'small');

    return (
        <List {...props}>
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

The validate function can be used to ensure forward compatibility. It must returns a boolean indicating wether the value is valid or not. It will be called in the following cases:

- to validate the initial default value and will throw an error if it is invalid.
- to validate the value initially returned by the store and the hook will revert the value to the default value if invalid.
- to validate the value returned by the store subscription mechanism and the hook will revert the value to the default value if invalid.
- to validate a new value from the setter function and the hook will revert the value to either the default value from the setter call or the default value if invalid.

```jsx
const defaultValue = { ui: { fontSize: 'large', mode: 'dark' } }
const validatePreferences = value => !!preferences.ui && !!preferences.ui.fontSize && !!preferences.ui.mode;
const preferences = useStore('preferences', defaultValue, validatePreferences);
// this will never fail
const { fontSize, mode } = preferences.ui;
```
