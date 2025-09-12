---
title: "useEditController"
---

`useEditController` contains the headless logic of the [`<EditBase>`](./EditBase.md) component. It's useful to create a custom edition view. It's also the base hook when building a custom view with another UI kit than Material UI. 

`useEditController` reads the resource name and id from the resource context and browser location, fetches the record via `dataProvider.getOne()` to initialize the form, prepares a form submit handler based on `dataProvider.update()`, computes the default page title, and returns them. Its return value matches the [`EditContext`](./useEditContext.md) shape. 

`useEditController` is used internally by [`<EditBase>`](./EditBase.md). If your Edit view uses ra-core components like [`<Form>`](./Form.md), prefer [`<EditBase>`](./EditBase.md) to `useEditController` as it takes care of creating a `<EditContext>`.

## Usage

Use `useEditController` to create a custom Edition view, with exactly the content you need. 

```jsx
import { useParams } from "react-router-dom";
import { useEditController, Form } from "ra-core";
import { TextInput, SelectInput } from "./inputs";

export const BookEdit = () => {
  const { id } = useParams();
  const { record, save, isPending } = useEditController({ resource: 'books', id });
  if (isPending) return null;
  return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Book Edition</h1>
        <div style={{ backgroundColor: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
          <Form record={record} onSubmit={save}>
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

**Tip**: If you just use the return value of `useEditController` to put it in an `EditContext`, use [the `<EditBase>` component](./EditBase.md) instead for simpler markup.


## Parameters

`useEditController` accepts an object with the following keys, all optional:

* [`disableAuthentication`](./EditBase.md#disableauthentication): Disable the authentication check
* [`id`](./EditBase.md#id): The id of the record to edit
* [`mutationMode`](./EditBase.md#mutationmode): Switch to optimistic or pessimistic mutations (undoable by default)
* [`mutationOptions`](./EditBase.md#mutationoptions): Options for the `dataProvider.update()` call
* [`queryOptions`](./EditBase.md#queryoptions): Options for the `dataProvider.getOne()` call
* [`redirect`](./EditBase.md#redirect): Change the redirect location after successful creation
* [`resource`](./EditBase.md#resource): Override the name of the resource to create
* [`transform`](./EditBase.md#transform): Transform the form data before calling `dataProvider.update()`

These fields are documented in [the `<EditBase>` component](./EditBase.md) documentation.

## Return Value

`useEditController` returns an object with the following fields:

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
} = useEditController();
```

## Security

`useEditController` requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](./EditBase.md#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `useEditController` will only render if the user has the "edit" access to the related resource.

For instance, for the `<PostEdit>` page below:

```tsx
import { useEditController, Form } from 'ra-core';
import { TextInput } from './TextInput';

const PostEdit = ({ id }) => {
  const { isPending, error, record, save } = useEditController({ resource: 'posts', id })
  if (error) return <div>Error!</div>;
  if (isPending) return <div>Loading...</div>;
  return (
      <Form record={record} onSubmit={save}>
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

`useEditController` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "edit", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./CoreAdmin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](./EditBase.md#disableauthentication).