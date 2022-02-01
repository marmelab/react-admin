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
