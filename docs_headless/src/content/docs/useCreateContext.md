---
title: "useCreateContext"
---

Whenever ra-core displays a creation page, it creates a `CreateContext` to store the submit callback.

The `CreateContext` is available to descendants of:

- `<CreateBase>`,

All descendant components can therefore access the Create context, using the `useCreateContext` hook.

## Usage

Call `useCreateContext` in a component that is a descendant of a `CreateBase` component.

```jsx
import { CreateBase, useCreateContext, Form } from 'ra-core';
import { TextInput } from './TextInput';

export const PostCreate = ({ id }) => (
    <CreateBase resource="posts" id={id}>
       <Aside />
       <PostCreateForm />
    </CreateBase>
);

const PostCreateForm = () => {
    const { save } = useCreateContext();
    return (
         <Form onSubmit={save}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                <TextInput source="title" />
                <TextInput source="views" />
                <button type="submit">Save</button>
            </div>
        </Form>
    );
};
```

## Return Value

`useCreateContext` returns an object with the same keys as [`useCreateController`](./useCreateController.md):

```jsx
const {
    defaultTitle, // Translated title based on the resource, e.g. 'Create New Post'
    redirect, // Default redirect route. Defaults to 'list'
    resource, // Resource name, deduced from the location. e.g. 'posts'
    save, // Update callback to be passed to the underlying form as submit handler
    saving, // Boolean, true when the dataProvider is called to create the record
} = useCreateContext();
```
