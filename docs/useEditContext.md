---
layout: default
title: "The useEditContext hook"
---

# `useEditContext`

Whenever react-admin displays an edition page, it creates an `EditContext` to store the record, the submit callback, and other data.

The `EditContext` is available to descendants of:

- `<Edit>`,
- `<EditGuesser>`,
- `<EditBase>`,

All descendant components can therefore access the Edit context, using the `useEditContext` hook. 

## Usage

Use `useEditContext` in a component that is a descendant of an `Edit` component, e.g. to display a sidebar with info about the record:

```jsx
import { Edit, useEditContext } from 'react-admin';
import { Typography } from '@mui/material';

export const PostEdit = () => (
    <Edit aside={<Aside />}>
        // ...
    </Edit>
);

const Aside = () => {
    const { record, isPending } = useEditContext();
    if (isPending) return null;
    return (
        <div>
            <Typography variant="h6">Posts stats</Typography>
            <Typography variant="body2">
                Last edition: {record.updated_at}
            </Typography>
        </div>
    );
};
```

## Return Value

`useEditContext` returns an object with the same keys as [`useEditController`](./useEditController.md):

```jsx
const {
    defaultTitle, // Translated title based on the resource, e.g. 'Post #123'
    error, // Error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the onError side effect.
    isFetching, // Boolean, true while the record is being fetched, false once done fetching
    isPending, // Boolean, true until the record is available for the first time
    mutationMode, // Mutation mode argument passed as parameter, or 'undoable' if not defined
    record, // Either the record fetched via dataProvider.getOne() based on the id from the location, a cached version of the record (see also the Caching documentation page) or undefined
    redirect, // Default redirection route. Defaults to 'list'
    refetch, // Function that allows you to refetch the record 
    resource, // Resource name deduced from the location. e.g. 'posts'
    save, // Update callback to be passed to the underlying form as submit handler
    saving, // Boolean, true when dataProvider is called to update the record
} = useEditContext();
```

## TypeScript

The `useEditContext` hook accepts a generic parameter for the record type:

```tsx
import { Edit, useEditContext } from 'react-admin';
import { Typography } from '@mui/material';

type Post = {
    id: number;
    title: string;
    updated_at: Date;
};

export const PostEdit = () => (
    <Edit aside={<Aside />}>
        // ...
    </Edit>
);

const Aside = () => {
    const { record: post, isPending } = useEditContext<Post>();
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
