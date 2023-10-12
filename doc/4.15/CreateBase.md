---
layout: default
title: "The CreateBase Component"
---

# `<CreateBase>`

The `<CreateBase>` component is a headless version of `<Create>`: it prepares a form submit handler, and renders its children. 

It does that by calling `useCreateController`, and by putting the result in an `CreateContext`.

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

You can customize the `<CreateBase>` component using the following props, documented in the `<Create>` component:

* `children`: the components that renders the form
* [`disableAuthentication`](./Create.md#disableauthentication): disable the authentication check
* [`mutationOptions`](./Create.md#mutationoptions): options for the `dataProvider.create()` call
* [`record`](./Create.md#record): initialize the form with a record
* [`redirect`](./Create.md#redirect): change the redirect location after successful creation
* [`resource`](./Create.md#resource): override the name of the resource to create
* [`transform`](./Create.md#transform): transform the form data before calling `dataProvider.create()`

