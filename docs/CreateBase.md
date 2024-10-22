---
layout: default
title: "The CreateBase Component"
---

# `<CreateBase>`

`<CreateBase>` is a headless variant of [`<Create>`](./Create.md). It prepares a form submit handler, and renders its children in a [`CreateContext`](./useCreateContext.md). Use it to build a custom creation page layout.

Contrary to [`<Create>`](./Create.md), it does not render the page layout, so no title, no actions, and no `<Card>`.

`<CreateBase>` relies on the [`useCreateController`](./useCreateController.md) hook.

## Usage

Use `<CreateBase>` to create a custom Creation view, with exactly the content you add as child and nothing else (no title, Card, or list of actions as in the `<Create>` component). 

```jsx
import * as React from "react";
import { CreateBase, SimpleForm, TextInput, SelectInput } from "react-admin";
import { Card } from "@mui/material";

export const BookCreate = () => ( 
    <CreateBase>
        <div>
            <Title title="Book Creation" />
            <Card>
                <SimpleForm>
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
    </CreateBase>
);
```

## Props

You can customize the `<CreateBase>` component using the following props, documented in the `<Create>` component:

* `children`: the components that renders the form
* [`disableAuthentication`](./Create.md#disableauthentication): disable the authentication check
* [`mutationOptions`](./Create.md#mutationoptions): options for the `dataProvider.create()` call
* [`record`](./Create.md#record): initialize the form with a record
* [`redirect`](./Create.md#redirect): change the redirect location after successful creation
* [`resource`](./Create.md#resource): override the name of the resource to create
* [`transform`](./Create.md#transform): transform the form data before calling `dataProvider.create()`

## Security

The `<CreateBase>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](./Create.md#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<CreateBase>`  will only render if the user has the "create" access to the related resource.

For instance, for the `<PostCreate>`page below:

```tsx
import { CreateBase, SimpleForm, TextInput } from 'react-admin';

// Resource name is "posts"
const PostCreate = () => (
    <CreateBase>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="published_at" />
        </SimpleForm>
    </CreateBase>
);
```

`<CreateBase>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "create", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./Admin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](./Create.md#disableauthentication).