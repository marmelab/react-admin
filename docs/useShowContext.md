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
    const {
        defaultTitle, // the translated title based on the resource, e.g. 'Post #123'
        error,  // error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the `onFailure` side effect.
        loaded, // boolean that is false until the record is available
        loading, // boolean that is true on mount, and false once the record was fetched
        record, // record fetched via dataProvider.getOne() based on the id from the location
        refetch, // callback to refetch the record via dataProvider.getOne()
        resource, // the resource name, deduced from the location. e.g. 'posts'
        version, // integer used by the refresh feature
    } = useShowContext();

    if (loading) {
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

## See Also

* [`useShowController`](./useShowController.md) computes all the data that is located in the ShowContext.

## API

* [`useShowContext`]
* [`useShowController`]

[`useShowContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/show/useShowContext.tsx
[`useShowController`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/show/useShowController.ts
