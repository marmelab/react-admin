---
layout: default
title: "The useCreateController hook"
---

# `useCreateController`

`useCreateController` contains the headless logic of the [`<Create>`](./Create.md) component. It's useful to create a custom creation view. It's also the base hook when building a custom view with another UI kit than Material UI. 

`useCreateController` reads the resource name from the resource context and browser location, computes the form default values, prepares a form submit handler based on `dataProvider.create()`, computes the default page title, and returns them. Its return value matches the [`CreateContext`](./useCreateContext.md) shape. 

`useCreateController` is used internally by [`<Create>`](./Create.md) and [`<CreateBase>`](./CreateBase.md). If your Create view uses react-admin components like [`<SimpleForm>`](./SimpleForm.md), prefer [`<CreateBase>`](./CreateBase.md) to `useCreateController` as it takes care of creating a `<CreateContext>`.

## Usage

Use `useCreateController` to create a custom creation view, with exactly the content you need. 

```tsx
import { useCreateController, SelectInput, SimpleForm, TextInput, Title } from "react-admin";
import { Card, CardContent, Container } from "@mui/material";

export const BookCreate = () => {
    const { save } = useCreateController();
    return (
        <Container>
            <Title title="Create book" />
            <Card>
                <CardContent>
                    <SimpleForm onSubmit={save}>
                        <TextInput source="title" />
                        <TextInput source="author" />
                        <SelectInput source="availability" choices={[
                            { id: "in_stock", name: "In stock" },
                            { id: "out_of_stock", name: "Out of stock" },
                            { id: "out_of_print", name: "Out of print" },
                        ]} />
                    </SimpleForm>
                </CardContent>
            </Card>
        </Container>
    );
};
```

**Tip**: If you just use the return value of `useCreateController` to put it in an `CreateContext`, use [the `<CreateBase>` component](./CreateBase.md) instead for simpler markup.


## Parameters

`useCreateController` accepts an object with the following keys, all optional:

* [`disableAuthentication`](./Create.md#disableauthentication): Disable the authentication check
* [`mutationOptions`](./Create.md#mutationoptions): Options for the `dataProvider.create()` call
* [`record`](./Create.md#record): Use the provided record as base instead of fetching it
* [`redirect`](./Create.md#redirect): Change the redirect location after successful creation
* [`resource`](./Create.md#resource): Override the name of the resource to create
* [`transform`](./Create.md#transform): Transform the form data before calling `dataProvider.create()`

These fields are documented in [the `<Create>` component](./Create.md) documentation.

## Return Value

`useCreateController` returns an object with the following keys:

```jsx
const {
    defaultTitle, // Translated title based on the resource, e.g. 'Create New Post'
    record, // Default values of the creation form
    redirect, // Default redirect route. Defaults to 'list'
    resource, // Resource name, deduced from the location. e.g. 'posts'
    save, // Update callback to be passed to the underlying form as submit handler
    saving, // Boolean, true when the dataProvider is called to create the record
} = useCreateController();
```

## Security

`<useCreateController>` requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](./Create.md#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `useCreateController` will only render if the user has the "create" access to the related resource.

For instance, for the `<PostCreate>` page below:

{% raw %}
```tsx
import { useCreateController, SimpleForm, TextInput } from 'react-admin';

const PostCreate = ({ id }) => {
  const { isPending, error, save } = useCreateController({ resource: 'posts' })
  if (error) return <div>Error!</div>;
  if (isPending) return <div>Loading...</div>;
  return (
      <SimpleForm record={{}} onSubmit={save}>
        <TextInput source="title" />
        <TextInput source="author" />
        <TextInput source="published_at" />
      </SimpleShowLayout>
  );
}
```
{% endraw %}

`useEditController` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "create", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./Admin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](./Create.md#disableauthentication).