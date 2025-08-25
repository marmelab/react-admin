---
title: "useRemoveFromStore"
---

This hook allows to remove a value from the [Store](../guides/Store.md). 

## Syntax

```jsx
import { useRemoveFromStore } from 'ra-core';

const remove = useRemoveFromStore();
remove(key);
```

The `key` should be a string, and is used to access local storage. It can be passed either when calling the hook, or when calling the callback:

```jsx
const remove = useRemoveFromStore(key);
remove();
```

## Example

```jsx
import { useRemoveFromStore } from 'ra-core';

const ResetPreferences = () => {
    const removeItem = useRemoveFromStore();
    return (
        <>
            <button onClick={() => removeItem('sidebar.open')}>
                Reset sidebar
            </button>
            <button onClick={() => removeItem('locale')}>
                Reset locale
            </button>
            <button onClick={() => removeItem('theme')}>
                Reset theme
            </button>
        </>
    );
};
```
