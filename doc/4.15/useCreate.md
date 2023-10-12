---
layout: default
title: "useCreate"
---

# `useCreate`

This hook allows to call `dataProvider.create()` when the callback is executed.

## Syntax

```jsx
const [create, { data, isLoading, error }] = useCreate(
    resource,
    { data, meta },
    options
);
```

The `create()` method can be called with the same parameters as the hook:

```jsx
create(
    resource,
    { data },
    options
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `create` callback (second example below).

## Usage

```jsx
// set params when calling the hook
import { useCreate, useRecordContext } from 'react-admin';

const LikeButton = () => {
    const record = useRecordContext();
    const like = { postId: record.id };
    const [create, { isLoading, error }] = useCreate('likes', { data: like });
    const handleClick = () => {
        create()
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};

// set params when calling the create callback
import { useCreate, useRecordContext } from 'react-admin';

const LikeButton = () => {
    const record = useRecordContext();
    const like = { postId: record.id };
    const [create, { isLoading, error }] = useCreate();
    const handleClick = () => {
        create('likes', { data: like })
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};
```

## TypeScript

The `useCreate` hook accepts a generic parameter for the record type and another for the error type:

```tsx
type Product = {
    id: number;
    reference: string;
}

useCreate<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type Product
        // TypeScript knows that error is of type Error
    },
})
```
