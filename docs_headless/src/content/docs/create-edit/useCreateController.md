---
title: "useCreateController"
---

`useCreateController` contains the headless logic of the [`<CreateBase>`](./CreateBase.md) component. It's useful to create a custom creation view. It's also the base hook when building a custom view with another UI kit than Material UI. 

`useCreateController` reads the resource name from the resource context and browser location, computes the form default values, prepares a form submit handler based on `dataProvider.create()`, computes the default page title, and returns them. Its return value matches the [`CreateContext`](./useCreateContext.md) shape. 

`useCreateController` is used internally by [`<CreateBase>`](./CreateBase.md). If your Create view uses ra-core components like [`<Form>`](./Form.md), prefer [`<CreateBase>`](./CreateBase.md) to `useCreateController` as it takes care of creating a `<CreateContext>`.

## Usage

Use `useCreateController` to create a custom creation view, with exactly the content you need. 

```tsx
import { useCreateController, Form } from "ra-core";
import { SelectInput, TextInput } from "./inputs";

export const BookCreate = () => {
    const { save } = useCreateController();
    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Create book</h1>
            <div style={{ backgroundColor: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
                <Form onSubmit={save}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <TextInput source="title" />
                        <TextInput source="author" />
                        <SelectInput source="availability" choices={[
                            { id: "in_stock", name: "In stock" },
                            { id: "out_of_stock", name: "Out of stock" },
                            { id: "out_of_print", name: "Out of print" },
                        ]} />
                        <button type="submit" style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
                            Save
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
};
```

**Tip**: If you just use the return value of `useCreateController` to put it in an `CreateContext`, use [the `<CreateBase>` component](./CreateBase.md) instead for simpler markup.


## Parameters

`useCreateController` accepts an object with the following keys, all optional:

* [`disableAuthentication`](./CreateBase.md#disableauthentication): Disable the authentication check
* [`mutationMode`](./CreateBase.md#mutationmode): Switch to optimistic or undoable mutations (pessimistic by default)
* [`mutationOptions`](./CreateBase.md#mutationoptions): Options for the `dataProvider.create()` call
* [`record`](./CreateBase.md#record): Use the provided record as base instead of fetching it
* [`redirect`](./CreateBase.md#redirect): Change the redirect location after successful creation
* [`resource`](./CreateBase.md#resource): Override the name of the resource to create
* [`transform`](./CreateBase.md#transform): Transform the form data before calling `dataProvider.create()`

These fields are documented in [the `<CreateBase>` component](./CreateBase.md) documentation.

## Return Value

`useCreateController` returns an object with the following keys:

```jsx
const {
    defaultTitle, // Translated title based on the resource, e.g. 'Create New Post'
    mutationMode, // Mutation mode argument passed as parameter, or 'pessimistic' if not defined
    record, // Default values of the creation form
    redirect, // Default redirect route. Defaults to 'list'
    resource, // Resource name, deduced from the location. e.g. 'posts'
    save, // Update callback to be passed to the underlying form as submit handler
    saving, // Boolean, true when the dataProvider is called to create the record
} = useCreateController();
```

## Security

`<useCreateController>` requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](./CreateBase.md#disableauthentication) prop.

If your `authProvider` implements [Access Control](../security/Permissions.md#access-control), `useCreateController` will only render if the user has the "create" access to the related resource.

For instance, for the `<PostCreate>` page below:

```tsx
import { useCreateController, Form } from 'ra-core';
import { TextInput } from './TextInput';

const PostCreate = ({ id }) => {
  const { isPending, error, save } = useCreateController({ resource: 'posts' })
  if (error) return <div>Error!</div>;
  if (isPending) return <div>Loading...</div>;
  return (
      <Form record={{}} onSubmit={save}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="published_at" />
            <button type="submit">Save</button>
        </div>
      </Form>
  );
}
```

`useCreateController` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "create", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](../app-configuration/CoreAdmin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](./CreateBase.md#disableauthentication).