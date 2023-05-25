---
layout: default
title: "useUpdate"
---

# `useUpdate`

This hook allows to call `dataProvider.update()` when the callback is executed, and update a single record based on its `id` and a `data` argument.

```jsx
// syntax
const [update, { data, isLoading, error }] = useUpdate(
    resource,
    { id, data, previousData },
    options
);
```

The `update()` method can be called with the same parameters as the hook:

```jsx
update(
    resource,
    { id, data, previousData },
    options
);
```

This means the parameters can be passed either when calling the hook, or when calling the callback. It's up to you to pick the syntax that best suits your component. If you have the choice, we recommend passing the parameters when calling the `update` callback (second example below).

```jsx
// set params when calling the hook
import { useUpdate, useRecordContext } from 'react-admin';

const IncreaseLikeButton = () => {
    const record = useRecordContext();
    const diff = { likes: record.likes + 1 };
    const [update, { isLoading, error }] = useUpdate(
        'likes',
        { id: record.id, data: diff, previousData: record }
    );
    const handleClick = () => {
        update()
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};

// set params when calling the update callback
import { useUpdate, useRecordContext } from 'react-admin';

const IncreaseLikeButton = () => {
    const record = useRecordContext();
    const diff = { likes: record.likes + 1 };
    const [update, { isLoading, error }] = useUpdate();
    const handleClick = () => {
        update(
            'likes',
            { id: record.id, data: diff, previousData: record }
        )
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};
```

## TypeScript

The `useUpdate` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useUpdate<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type Product
        // TypeScript knows that error is of type Error
    },
})
```
