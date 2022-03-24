---
layout: default
title: "The useEditContext hook"
---

# `useEditContext`

Whenever react-admin displays an edition page, it creates an `EditContext` to store the record, the submit callback, and other data.

The `CreateContext` is available to descendants of:

- `<Create>`,
- `<CreateGuesser>`,
- `<CreateBase>`,

All descendant components can therefore access the Create context, using the `useCreateContext` hook. 

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
    const { record, isLoading } = usEditContext();
    if (isLoading) return null;
    return (
        <div>
            <Typography variant="h6">Posts stats</Typography>
            <Typography variant="body2">
                Last edition: {post.updated_at}
            </Typography>
        </div>
    );
};
```

## Return Value

The `useEditContext` hook returns an object with the same keys as returned by [`useEditController`](#useEditController):

```jsx
const {
    defaultTitle, // the translated title based on the resource, e.g. 'Post #123'
    error,  // error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the `onError` side effect.
    isFetching, // boolean that is true while the record is being fetched, and false once the record is fetched
    isLoading, // boolean that is true until the record is available for the first time
    mutationMode, // mutation mode argument passed as parameter, or 'undoable' if not defined
    record, // record fetched via dataProvider.getOne() based on the id from the location
    redirect, // the default redirection route. Defaults to 'list'
    refetch, // a function that allows you to refetch the record 
    resource, // the resource name, deduced from the location. e.g. 'posts'
    save, // the update callback, to be passed to the underlying form as submit handler
    saving, // boolean that becomes true when the dataProvider is called to update the record
} = useEditContext();
```