---
layout: default
title: "The FunctionField Component"
---

# `<FunctionField>`

If you need a special function to render a field, `<FunctionField>` is the perfect match. It executes a `render` function using the current record as parameter.

<iframe src="https://www.youtube-nocookie.com/embed/gcgefw79QdM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

## Usage

`<FunctionField>` requires a `render` prop, which is a function that takes the current record as argument and returns a string or an element.

For instance, to display the full name of a `user` record based on `first_name` and `last_name` properties:

```jsx
import { List, Datagrid, FunctionField } from 'react-admin';

const UserList = () => (
    <List>
        <Datagrid>
            <FunctionField
                source="last_name"
                render={record => `${record.first_name} ${record.last_name}`}
            />
            ...
        </Datagrid>
    </List>
);
```

Theoretically, you can omit the `source` for the `<FunctionField>` since you provide the render function. However, when used inside a `<Datagrid>`, providing the `source` prop (or the `sortBy` prop) is required to make the column sortable. When a user clicks on a column, `<Datagrid>` uses these properties to sort the data.

`<FunctionField>` is based on [the `useRecordContext` hook](./useRecordContext.md).

## Props

| Prop     | Required | Type     | Default | Description                                                                |
| -------- | -------- | -------- | ------- | -------------------------------------------------------------------------- |
| `render` | Required | function | -       | A function returning a string (or an element) to display based on a record |

`<FunctionField>` also accepts the [common field props](./Fields.md#common-field-props).

## `render`

The `render` prop accepts a function that takes the current record as argument and returns a string or an element.

```tsx
// return a string
const render = (record: any) => `${record.first_name} ${record.last_name}`;

// return an element
const render = (record: any) => (
    <>{record.first_name} <strong>{record.last_name}</strong></>
);
```

React-admin wraps the result of the `render` function in a `<Typography>` component.

Since this function executes in a [RecordContext](./useRecordContext.md), you can even use other Field components to compute the value:

```tsx
import { List, Datagrid, FunctionField, TextField } from 'react-admin';

const render = () => (
    <span>
        <TextField source="first_name" />{' '}
        <TextField source="last_name" />
    </span>
);
const UserList = () => (
    <List>
        <Datagrid>
            <FunctionField source="last_name" label="Name" render={render} />
            ...
        </Datagrid>
    </List>
);
```

However, if you only need to combine Field components, prefer [the `<WrapperField>` component](./WrapperField.md) for a simpler syntax:

```tsx
import { List, Datagrid, WrapperField, TextField } from 'react-admin';

const UserList = () => (
    <List>
        <Datagrid>
            <WrapperField label="Name" source="last_name">
                <TextField source="first_name" />
                <TextField source="last_name" />
            </WrapperField>
            ...
        </Datagrid>
    </List>
);
```

## TypeScript

To type the `record` argument of the `render` function, provide the record's type as a generic parameter to the component:

```tsx
import { List, Datagrid, FunctionField } from 'react-admin';

interface User {
    id: number;
    first_name: string;
    last_name: string;
}

const UserList = () => (
    <List>
        <Datagrid>
            <FunctionField<User>
                source="last_name"
                label="Name"
                render={record => `${record.first_name} ${record.last_name}`}
            />
            ...
        </Datagrid>
    </List>
);
```