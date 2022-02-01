---
layout: default
title: "useResetStore"
---

# `useResetStore`

This hook allows to empty the [Store](./Store.md). React-admin uses it at logout.

## Syntax

```jsx
import { useResetStore } from 'react-admin';

const reset = useResetStore();
reset();
```

## Example

```jsx
const ResetButton = () => {
    const reset = useResetStore();
    return (
        <Button onClick={() => reset()}>
            Reset store
        </Button>
    );
};
```
