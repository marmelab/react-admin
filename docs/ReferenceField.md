---
layout: default
title: "The ReferenceField Component"
---

# `<ReferenceField>`

`<ReferenceField>` is useful for displaying many-to-one and one-to-one relationships, e.g. the details of a user when rendering a post authored by that user. 

```
┌──────────────┐       ┌────────────────┐
│ posts        │       │ users          │
│--------------│       │----------------│
│ id           │   ┌───│ id             │
│ user_id      │╾──┘   │ name           │
│ title        │       │ date_of_birth  │
│ published_at │       └────────────────┘
└──────────────┘
```

```jsx
<ReferenceField source="user_id" reference="users">
    <TextField source="name" />
</ReferenceField>
```

A `<ReferenceField>` displays nothing on its own, it just fetches the data, puts it in a [`RecordContext`](./useRecordContext.md), and lets its children render it. Usual child components for `<ReferenceField>` are other `<Field>` components (e.g. [`<TextField>`](./TextField.md)).

This component fetches a referenced record (`users` in this example) using the `dataProvider.getMany()` method, and passes it to its child. It uses `dataProvider.getMany()` instead of `dataProvider.getOne()` for performance reasons. When using several `<ReferenceField>` in the same page (e.g. in a `<Datagrid>`), this allows to call the `dataProvider` once instead of once per row. 

## Usage

For instance, let's consider a model where a `post` has one author from the `users` resource, referenced by a `user_id` field.

Here is how to render both a post and the `name` of its author in a show view:

```jsx
import { Show, SimpleShowLayout, ReferenceField, TextField, DateField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <ReferenceField label="Author" source="user_id" reference="users">
                <TextField source="name" />
            </ReferenceField>
        </SimpleShowLayout>
    </Show>
);
```

With this configuration, `<ReferenceField>` wraps the user's name in a link to the related user `<Edit>` page.

## Props

| Prop        | Required | Type                | Default  | Description                                                                                                         |
| ----------- | -------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `children`  | Required | `ReactNode`           | -        | One or more Field elements used to render the referenced record                                                              |
| `reference` | Required | `string`            | -        | The name of the resource for the referenced records, e.g. 'posts'                                                   |
| `label`     | Optional | `string | Function` | `resources.[resource].fields.[source]`   | Label to use for the field when rendered in layout components  |
| `link`      | Optional | `string | Function` | `edit`   | Target of the link wrapping the rendered child. Set to `false` to disable the link.                                 |
| `sortBy`    | Optional | `string | Function` | `source` | Name of the field to use for sorting when used in a Datagrid                                     |

`<ReferenceField>` also accepts the [common field props](./Fields.md#common-field-props).

## `label`

By default, `<SimpleShowLayout>`, `<Datagrid>` and other layout components infer the label of a field based on its `source`. For a `<ReferenceField>`, this may not be what you expect:

```jsx
{/* default label is 'User Id', or the translation of 'resources.posts.fields.user_id' if it exists */}
<ReferenceField source="user_id" reference="users" link="show">
    <TextField source="name" />
</ReferenceField>
```

That's why you often need to set an explicit `label` on a `<ReferenceField>`:

```jsx
<ReferenceField label="Author name" source="user_id" reference="users" link="show">
    <TextField source="name" />
</ReferenceField>
```

## `link`

To change the link from the `<Edit>` page to the `<Show>` page, set the `link` prop to "show".

```jsx
<ReferenceField source="user_id" reference="users" link="show">
    <TextField source="name" />
</ReferenceField>
```

You can also prevent `<ReferenceField>` from adding a link to children by setting `link` to `false`.

```jsx
// No link
<ReferenceField source="user_id" reference="users" link={false}>
    <TextField source="name" />
</ReferenceField>
```

You can also use a custom `link` function to get a custom path for the children. This function must accept `record` and `reference` as arguments.

```jsx
// Custom path
<ReferenceField source="user_id" reference="users" link={(record, reference) => `/my/path/to/${reference}/${record.id}`}>
    <TextField source="name" />
</ReferenceField>
```

## `reference`

The resource to fetch for the related record.

For instance, if the `posts` resource has a `user_id` field, set the `reference` to `users` to fetch the user related to each post.

```jsx
<ReferenceField source="user_id" reference="users">
    <TextField source="name" />
</ReferenceField>
```

## `sortBy`

By default, when used in a `<Datagrid>`, and when the user clicks on the column header of a `<ReferenceField>`, react-admin sorts the list by the field `source`. To specify another field name to sort by, set the `sortBy` prop.

```jsx
<ReferenceField source="user_id" reference="users" sortBy="user.name">
    <TextField source="name" />
</ReferenceField>
```

## `sx`: CSS API

The `<ReferenceField>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                  | Description                   |
|----------------------------|-------------------------------|
| `& .RaReferenceField-link` | Applied to each child element |

To override the style of all instances of `<ReferenceField>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaReferenceField` key.

## Rendering More Than One Field

You often need to render more than one field of the reference table (e.g. if the `users` table has a `first_name` and a `last_name` field).

Given that `<ReferenceField>` can accept more than one child, you can use as many `<Field>` as you like:

```jsx
import { Show, SimpleShowLayout, ReferenceField, TextField, DateField, FunctionField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <ReferenceField label="Author" source="user_id" reference="users">
                <TextField source="first_name" />{' '}
                <TextField source="last_name" />
            </ReferenceField>
        </SimpleShowLayout>
    </Show>
);
```

You can also use several `<ReferenceField>` for the same resource in a given view - react-admin will deduplicate them and only make one call to the distant table. This is useful e.g. is you want to have one label per field:

```jsx
import { Show, SimpleShowLayout, ReferenceField, TextField, DateField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <ReferenceField label="First name" source="user_id" reference="users">
                <TextField source="first_name" />
            </ReferenceField>
            <ReferenceField label="Last name" source="user_id" reference="users">
                <TextField source="last_name" />
            </ReferenceField>
        </SimpleShowLayout>
    </Show>
);
```

You can also use a [`<FunctionField>`](./FunctionField.md) to render a string composed of several fields.

```jsx
import { Show, SimpleShowLayout, ReferenceField, TextField, DateField, FunctionField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <ReferenceField label="Name" source="user_id" reference="users">
                <FunctionField render={record => `${record.first_name} ${record.last_name}`} />
            </ReferenceField>
        </SimpleShowLayout>
    </Show>
);
```

## Performance

When used in a `<Datagrid>`, `<ReferenceField>` fetches the referenced record only once for the entire table. 

![ReferenceField](./img/reference-field.png)

For instance, with this code:

```jsx
import { List, Datagrid, ReferenceField, TextField, EditButton } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField label="User" source="user_id" reference="users">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="title" />
            <EditButton />
        </Datagrid>
    </List>
);
```

React-admin accumulates and deduplicates the ids of the referenced records to make *one* `dataProvider.getMany()` call for the entire list, instead of n `dataProvider.getOne()` calls. So for instance, if the API returns the following list of posts:

```js
[
    {
        id: 123,
        title: 'Totally agree',
        user_id: 789,
    },
    {
        id: 124,
        title: 'You are right my friend',
        user_id: 789
    },
    {
        id: 125,
        title: 'Not sure about this one',
        user_id: 735
    }
]
```

Then react-admin renders the `<PostList>` with a loader for the `<ReferenceField>`, fetches the API for the related users in one call (`dataProvider.getMany('users', { ids: [789,735] }`), and re-renders the list once the data arrives. This accelerates the rendering and minimizes network load.
