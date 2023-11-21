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

## Input Format

`useCreateController` accepts an options argument, with the following fields, all optional:

* [`disableAuthentication`](./Create.md#disableauthentication): disable the authentication check
* [`mutationOptions`](./Create.md#mutationoptions): options for the `dataProvider.create()` call
* [`record`](./Create.md#record): use the provided record as base instead of fetching it
* [`redirect`](./Create.md#redirect): change the redirect location after successful creation
* [`resource`](./Create.md#resource): override the name of the resource to create
* [`transform`](./Create.md#transform): transform the form data before calling `dataProvider.create()`

These fields are documented in [the `<Create>` component](./Create.md) documentation.

## Return Value

`useCreateController` returns an object with the following fields:

```jsx
const {
    defaultTitle, // the translated title based on the resource, e.g. 'Create New Post'
    record, // the default values of the creation form
    redirect, // the default redirection route. Defaults to 'list'
    resource, // the resource name, deduced from the location. e.g. 'posts'
    save, // the update callback, to be passed to the underlying form as submit handler
    saving, // boolean that becomes true when the dataProvider is called to create the record
} = useCreateController();
```

