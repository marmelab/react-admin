---
layout: default
title: "The EditBase Component"
---

# `<EditBase>`

`<EditBase>` is a headless variant of [`<Edit>`](./Edit.md): it fetches a record based on the URL, prepares a form submit handler, and renders its children inside an [`EditContext`](./useEditContext.md). Use it to build a custom edition page layout.

Contrary to [`<Edit>`](./Edit.md), it does not render the page layout, so no title, no actions, and no `<Card>`.

`<EditBase>` relies on the [`useEditController`](./useEditController.md) hook.

## Usage

Use `<EditBase>` to create a custom Edition view, with exactly the content you add as child and nothing else (no title, Card, or list of actions as in the `<Edit>` component). 

```jsx
import { EditBase, SelectInput, SimpleForm, TextInput, Title } from "react-admin";
import { Card, CardContent, Container } from "@mui/material";

export const BookEdit = () => (
    <EditBase>
        <Container>
            <Title title="Book Edition" />
            <Card>
                <CardContent>
                    <SimpleForm>
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
    </EditBase>
);
```

## Props

You can customize the `<EditBase>` component using the following props, documented in the `<Edit>` component:

* `children`: the components that renders the form
* [`disableAuthentication`](./Edit.md#disableauthentication): disable the authentication check
* [`id`](./Edit.md#id): the id of the record to edit
* [`mutationMode`](./Edit.md#mutationmode): switch to optimistic or pessimistic mutations (undoable by default)
* [`mutationOptions`](./Edit.md#mutationoptions): options for the `dataProvider.update()` call
* [`queryOptions`](./Edit.md#queryoptions): options for the `dataProvider.getOne()` call
* [`redirect`](./Edit.md#redirect): change the redirect location after successful creation
* [`resource`](./Edit.md#resource): override the name of the resource to create
* [`transform`](./Edit.md#transform): transform the form data before calling `dataProvider.update()`

## Security

The `<EditBase>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](./Edit.md#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<EditBase>`  will only render if the user has the "edit" access to the related resource.

For instance, for the `<PostEdit>`page below:

```tsx
import { EditBase, SimpleForm, TextInput } from 'react-admin';

// Resource name is "posts"
const PostEdit = () => (
    <EditBase>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="published_at" />
        </SimpleForm>
    </EditBase>
);
```

`<EditBase>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "edit", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./Admin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](./Edit.md#disableauthentication).
