---
layout: default
title: "The useCreateController hook"
---

# `useCreateController`

The `useCreateController` hook contains the logic of [the `<Create>` component](./Create.md): it prepares a form submit handler, and returns the data and callbacks necessary to render a Creation view. 

React-admin calls `useCreateController` internally, when you use the `<Create>`, or `<CreateBase>` component.

## Usage

Use `useCreateController` to create a custom creation view, with exactly the content you need. 

{% raw %}
```jsx
import * as React from "react";
import { useCreateController, CreateContextProvider, SimpleForm, TextInput, SelectInput } from "react-admin";
import { Card } from "@mui/material";

export const BookCreate = () => {
  const { save } = useCreateController({ resource: 'books' });
  return (
      <div>
        <Title title="Book Creation" />
        <Card>
          <SimpleForm onSubmit={save} record={{}} >
            <TextInput source="title" />
            <TextInput source="author" />
            <SelectInput source="availability" choices={[
              { id: "in_stock", name: "In stock" },
              { id: "out_of_stock", name: "Out of stock" },
              { id: "out_of_print", name: "Out of print" },
            ]} />
          </SimpleForm>
        </Card>
      </div>
  );
};
```
{% endraw %}

**Tip**: If you just use the return value of `useCreateController` to put it in an `CreateContext`, use [the `<CreateBase>` component](./CreateBase.md) instead for simpler markup.

`useCreateController` accepts an options argument, with the following fields, all optional:

* [`disableAuthentication`](./Create.md#disableauthentication): disable the authentication check
* [`mutationOptions`](./Create.md#mutationoptions): options for the `dataProvider.create()` call
* [`record`](./Create.md#record): use the provided record as base instead of fetching it
* [`redirect`](./Create.md#redirect): change the redirect location after successful creation
* [`resource`](./Create.md#resource): override the name of the resource to create
* [`transform`](./Create.md#transform): transform the form data before calling `dataProvider.create()`

`useCreateController` returns an object with the following fields:

```jsx
const {
    defaultTitle, // the translated title based on the resource, e.g. 'Create New Post'
    redirect, // the default redirection route. Defaults to 'list'
    resource, // the resource name, deduced from the location. e.g. 'posts'
    save, // the update callback, to be passed to the underlying form as submit handler
    saving, // boolean that becomes true when the dataProvider is called to create the record
} = useCreateController();
```

