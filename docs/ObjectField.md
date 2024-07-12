---
layout: default
title: "The ObjectField Component"
---

# `<ObjectField>`

`<ObjectField>` renders an embedded object.

![ObjectField](./img/object-field.webp)

`<ObjectField>` creates a context with the field value and renders its children components.

## Usage

`<ObjectField>` is ideal for displaying nested objects, e.g., `shipping` details in the following `order` object:

```json
{
    "id": 123,
    "customer": "John Doe",
    "shipping": {
        "address": "123 Main St",
        "zipcode": "12345"
    }
}
```

Leverage `<ObjectField>` in a Show view to display the shipping details:

```jsx
import { 
    ObjectField,
    Show,
    SimpleShowLayout,
    TextField
} from 'react-admin';

const OrderShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="customer" />
            <ObjectField source="shipping">
                <TextField source="address" />
                <TextField source="zipcode" />
            </ObjectField>
        </SimpleShowLayout>
    </Show>
);
```

## Props

| Prop         | Required                             | Type         | Default  | Description                                            |
|--------------|--------------------------------------|--------------|----------|--------------------------------------------------------|
| `children`   | Required (optional in `<Show>` view) | `ReactNode`  |          | The component to render the nested fields.             |
| `source`     | Required                             | `string`     |          | The source of the nested object in the record.         |
| `record`     | Required                             | `object`     |          | The record containing the nested object.               |
| `label`      | Optional                             | `string`     |          | The label to use for the field                         |
| `showLabel`  | Optional                             | `boolean`    | `true`   | Whether or not to show the labels of the nested fields |

## children

`<ObjectField>` renders its children component with the nested object data. Commonly used child components are `<TextField>`, `<NumberField>` and `<DateField>`.

```jsx
{/* using TextField as child */}
<ObjectField source="shipping">
    <TextField source="address" />
    <TextField source="zipcode" />
</ObjectField>
```

You can also render custom JSX, leveraging the record context:

```jsx
import { useRecordContext } from 'react-admin';

const CustomShippingField = () => {
    const record = useRecordContext();
    return (
        <div>
            <p>{record.shipping.address}</p>
            <p>{record.shipping.zipcode}</p>
        </div>
    );
};

const OrderShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="customer" />
            <ObjectField source="shipping">
                <CustomShippingField />
            </ObjectField>
        </SimpleShowLayout>
    </Show>
);
```

## Example with Grid

`<ObjectField>` can be used inside a Grid component to display nested fields:

```jsx
import { CardContent } from '@mui/material';
import { ObjectField, TextField } from 'react-admin';

const Grid = () => (
    <Grid spacing={2} container>
            {data.map(record => (
                <Grid item key={record.id} sm={12} md={6} lg={4}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                                <ObjectField source="shipping">
                                    <TextField source="address" />
                                    <TextField source="zipcode" />
                                </ObjectField>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
```

## Example in Show component

Using `<ObjectField>` in a Show component for displaying nested fields:

```jsx
import * as React from 'react';
import {
    DateField,
    ReferenceField,
    Show,
    SimpleShowLayout,
    TextField,
    ObjectField
} from 'react-admin';

const CommentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="post_id" reference="posts">
                <TextField source="title" />
            </ReferenceField>
            <TextField source="author.name" />
            <DateField source="created_at" />
            <TextField source="body" />
            <ObjectField source="shipping">
                <TextField source="address" />
                <TextField source="zipcode" />
            </ObjectField>
        </SimpleShowLayout>
    </Show>
);

export default CommentShow;

```

By using `<ObjectField>`, you can easily render and display nested object fields within your React-Admin application.