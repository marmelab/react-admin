---
layout: default
title: "useStoreContext"
---

# `useStoreContext`

This hook allows to access the global [Store](./Store.md).

It should not be used directly. Prefer the specialized hooks (`useStore`, `useResetStore`, `useRemoveFromStore`) instead.

## Syntax

```jsx
import { useStoreContext } from 'react-admin';

const store = useStoreContext();
```
