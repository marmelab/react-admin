---
layout: default
title: "The useEditController hook"
---

# `useEditController`

`useEditController` contains the headless logic of the [`<Edit>`](./Edit.md) component. It's useful to create a custom edition view. It's also the base hook when building a custom view with another UI kit than Material UI. 

`useEditController` reads the resource name and id from the resource context and browser location, fetches the record via `dataProvider.getOne()` to initialize the form, prepares a form submit handler based on `dataProvider.update()`, computes the default page title, and returns them. Its return value matches the [`EditContext`](./useEditContext.md) shape. 

`useEditController` is used internally by [`<Edit>`](./Edit.md) and [`<EditBase>`](./EditBase.md). If your Edit view uses react-admin components like [`<SimpleForm>`](./SimpleForm.md), prefer [`<EditBase>`](./EditBase.md) to `useEditController` as it takes care of creating a `<EditContext>`.

## Usage

Use `useEditController` to create a custom Edition view, with exactly the content you need. 

```jsx
import { useParams } from "react-router-dom";
import { useEditController, EditContextProvider, SimpleForm, TextInput, SelectInput } from "react-admin";
import { Card } from "@mui/material";

export const BookEdit = () => {
  const { id } = useParams();
  const { record, save, isLoading } = useEditController({ resource: 'books', id });
  if (isLoading) return null;
  return (
      <div>
        <Title title="Book Edition" />
        <Card>
          <SimpleForm record={record} onSubmit={save}>
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

**Tip**: If you just use the return value of `useEditController` to put it in an `EditContext`, use [the `<EditBase>` component](./EditBase.md) instead for simpler markup.


## Parameters

`useEditController` accepts an object with the following keys, all optional:

* [`disableAuthentication`](./Edit.md#disableauthentication): Disable the authentication check
* [`id`](./Edit.md#id): The id of the record to edit
* [`mutationMode`](./Edit.md#mutationmode): Switch to optimistic or pessimistic mutations (undoable by default)
* [`mutationOptions`](./Edit.md#mutationoptions): Options for the `dataProvider.update()` call
* [`queryOptions`](./Edit.md#queryoptions): Options for the `dataProvider.getOne()` call
* [`redirect`](./Edit.md#redirect): Change the redirect location after successful creation
* [`resource`](./Edit.md#resource): Override the name of the resource to create
* [`transform`](./Edit.md#transform): Transform the form data before calling `dataProvider.update()`

These fields are documented in [the `<Edit>` component](./Edit.md) documentation.

## Return Value

`useEditController` returns an object with the following fields:

```jsx
const {
    defaultTitle, // Translated title based on the resource, e.g. 'Post #123'
    isFetching, // Boolean, true while the record is being fetched, false once done fetching
    isLoading, // Boolean, true until the record is available for the first time
    mutationMode, // Mutation mode argument passed as parameter, or 'undoable' if not defined
    record, // Either the record fetched via dataProvider.getOne() based on the id from the location, a cached version of the record (see also the Caching documentation page) or undefined 
    redirect, // Default redirection route. Defaults to 'list'
    refetch, // Function that allows you to refetch the record 
    resource, // Resource name deduced from the location. e.g. 'posts'
    save, // Update callback to be passed to the underlying form as submit handler
    saving, // Boolean, true when dataProvider is called to update the record
    error, // Error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the onError side effect.
} = useEditController();
```

