---
title: "useResetStore"
---

This hook allows to empty the [Store](../guides/Store.md). React-admin uses it at logout.

## Syntax

```jsx
import { useResetStore } from 'ra-core';

const reset = useResetStore();
reset();
```

## Example

```jsx
import { useResetStore } from 'ra-core';

const ResetButton = () => {
    const reset = useResetStore();
    return (
        <button onClick={() => reset()}>
            Reset store
        </button>
    );
};
```
