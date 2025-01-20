---
layout: default
title: "useShowContext"
---

# `useShowContext`

`useShowContext` grabs the data computed by `useShowController` when inside a `<Show>` or a `<ShowBase>` component.

## Usage

You can use `useShowContext` inside show components to access the data computed by the controller. 

```jsx
import { useShowContext, SimpleShowLayout, Show } from 'react-admin';

const PostShowLayout = () => {
    const { defaultTitle, error, isPending } = useShowContext();

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error!</div>;
    }

    return (
        <>
            <h1>{defaultTitle}</h1>
            <SimpleShowLayout>
                <TextField source="title" />
                ...
            </SimpleShowLayout>
        </>
    );
};

const PostShow = () => (
    <Show>
        <PostShowLayout />
    </Show>
)
```

## Return Value

`useShowContext` returns an object with the same keys as [`useShowController`](./useShowController.md):

```jsx
const {
    defaultTitle, // Translated title based on the resource, e.g. 'Post #123'
    isPending, // Boolean, true until the record is available
    isFetching, // Boolean, true while the record is being fetched, and false once done fetching
    isLoading, // Boolean, true until the record is fetched for the first time
    record, // Either the record fetched via dataProvider.getOne() based on the id from the location, a cached version of the record (see also the Caching documentation page) or undefined 
    refetch, // Callback to refetch the record via dataProvider.getOne()
    resource, // The resource name, deduced from the location. e.g. 'posts'
    error, // Error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the onError side effect.
} = useShowContext();
```

## TypeScript

The `useShowContext` hook accepts a generic parameter for the record type:

```tsx
import { Show, useShowContext } from 'react-admin';
import { Typography } from '@mui/material';

type Post = {
    id: number;
    title: string;
    updated_at: Date;
};

export const PostShow = () => (
    <Show aside={<Aside />}>
        // ...
    </Show>
);

const Aside = () => {
    const { record: post, isPending } = useShowContext<Post>();
    if (isPending) return null;
    return (
        <div>
            <Typography variant="h6">Posts stats</Typography>
            <Typography variant="body2">
                {/* TypeScript knows that post is of type Post */}
                Last edition: {post.updated_at}
            </Typography>
        </div>
    );
};
```

## See Also

* [`useShowController`](./useShowController.md) computes all the data that is located in the ShowContext.

## API

* [`useShowContext`]
* [`useShowController`]

[`useShowContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/show/useShowContext.tsx
[`useShowController`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/show/useShowController.ts
