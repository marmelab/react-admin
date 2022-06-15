---
layout: default
title: "The ReferenceArrayField Component"
---

# `<ReferenceArrayField>`

Use `<ReferenceArrayField>` to display a list of related records, via a one-to-many relationship materialized by an array of foreign keys.

![ReferenceArrayField](./img/reference-array-field.png)

For instance, let's conside a model where a `post` has many `tags`, materialized to a `tags_ids` field containing an array of ids:

```
┌──────────────┐       ┌────────┐
│ posts        │       │ tags   │
│--------------│       │--------│
│ id           │   ┌───│ id     │
│ title        │   │   │ name   │
│ body         │   │   └────────┘
│ is_published │   │
│ tag_ids      │╾──┘   
└──────────────┘       
```

In that case, use `<ReferenceArrayField>` to display the post tags names as follows:

```jsx
<ReferenceArrayField label="Tags" reference="tags" source="tag_ids">
    <SingleFieldList>
        <ChipField source="name" />
    </SingleFieldList>
</ReferenceArrayField>
```

`<ReferenceArrayField>` fetches a list of referenced records (using the `dataProvider.getMany()` method), and and puts them in a [`ListContext`](./useListContext.md). A `<ReferenceArrayField>` displays nothing on its own, it just fetches the data and expects its children to render it. The most common case is to use [`<SingleFieldList>`](./SingleFieldList.md) or [`<Datagrid>`](./Datagrid.md) as child.

**Tip**: If the relationship is materialized by a foreign key on the referenced resource, use [the `<ReferenceManyField>` component](./ReferenceManyField.md) instead.

## Usage

`<ReferenceArrayField>` expects a `reference` attribute, which specifies the resource to fetch for the related records. It also expects a `source` attribute, which defines the field containing the list of ids to look for in the referenced resource.

For instance, if each post contains a list of tag ids (e.g. `{ id: 1234, title: 'Lorem Ipsum', tag_ids: [1, 23, 4] }`), here is how to fetch the list of tags for each post in a list, and display the `name` for each `tag` in a `<ChipField>`:

```jsx
import * as React from "react";
import { List, Datagrid, ChipField, ReferenceArrayField, SingleFieldList, TextField } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceArrayField label="Tags" reference="tags" source="tag_ids">
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceArrayField>
            <EditButton />
        </Datagrid>
    </List>
);
```

`<ReferenceArrayField>` fetches the `tag` resources related to each `post` resource by matching `post.tag_ids` to `tag.id`. Once it receives the related resources, `<ReferenceArrayField>` passes them to its child component using the `ids` and `data` props, so the child must be an iterator component (like `<SingleFieldList>` or `<Datagrid>`). The iterator component usually has one or more child `<Field>` components.

## Props

| Prop         | Required | Type                | Default  | Description                                                                                                  |
| ------------ | -------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `source`     | Required | `string`            | -        | Name of the property to display                                                                              |
| `reference`  | Required | `string`            | -        | The name of the resource for the referenced records, e.g. 'tags'                                             |
| `children`   | Required | `Element`           | -        | The Field element used to render the referenced records                                                      |
| `sortBy`     | Optional | `string | Function` | `source` | When used in a `List`, name of the field to use for sorting when the user clicks on the column header.       |
| `filter`     | Optional | `Object`            | -        | Filters to use when fetching the related records (the filtering is done client-side)                         |
| `pagination` | Optional | `Element`           | -        | Pagination element to display pagination controls. empty by default (no pagination)                          |
| `perPage`    | Optional | `number`            | 1000     | Maximum number of results to display                                                                         |
| `sort`       | Optional | `{ field, order }`  | `{ field: 'id', order: 'DESC' }` | Sort order to use when displaying the related records (the sort is done client-side) |

`<ReferenceArrayField>` also accepts the [common field props](./Fields.md#common-field-props), except `emptyText` (use the child `empty` prop instead).

## `filter`

`<ReferenceArrayField>` fetches all the related records, and displays them all, too. You can use the `filter` prop to filter the list of related records to dispaly (this works by filtering the records client-side, after the fetch).

For instance, to render only tags that are 'published', you can use the following code:

{% raw %}
```jsx
<ReferenceArrayField 
    label="Tags"
    source="tag_ids"
    reference="tags"
    filter={{ is_published: true }}
>
    <SingleFieldList>
        <ChipField source="name" />
    </SingleFieldList>
</ReferenceField>
```
{% endraw %}

## `label`

By default, `<SimpleShowLayout>`, `<Datagrid>` and other layout components infer the label of a field based on its `source`. For a `<ReferenceArrayField>`, this may not be what you expect:

```jsx
{/* default label is 'Tag Ids', or the translation of 'resources.posts.fields.tag_ids' if it exists */}
<ReferenceArrayField source="tag_ids" reference="tags">
    <SingleFieldList>
        <ChipField source="name" />
    </SingleFieldList>
</ReferenceField>
```

That's why you often need to set an explicit `label` on a `<ReferenceField>`:

```jsx
<ReferenceArrayField label="Tags" source="tag_ids" reference="tags">
    <SingleFieldList>
        <ChipField source="name" />
    </SingleFieldList>
</ReferenceField>
```

React-admin uses [the i18n system](./Translation.md) to translate the label, so you can use translation keys to have one label for each language supported by the interface:

```jsx
<ReferenceArrayField label="resource.posts.fields.tags" source="tag_ids" reference="tags">
    <SingleFieldList>
        <ChipField source="name" />
    </SingleFieldList>
</ReferenceField>
```

## `pagination`

`<ReferenceArrayField>` fetches *all* the related fields, and puts them all in a `ListContext`. If a record has a large number of related records, you can limit the number of displayed records with the [`perPage`](#perpage) prop. Then, let users display remaining records by rendering pagination controls. For that purpose, pass a pagination element to the `pagination` prop.

For instance, to limit the display of related records to 10, you can use the following code:

```jsx
import { Pagination, ReferenceArrayField } from 'react-admin';

<ReferenceArrayField
    label="Tags"
    source="tag_ids"
    reference="tags"
    perPage={10}
    pagination={<Pagination />}>
   ...
</ReferenceArrayField>
```

## `perPage`

`<ReferenceArrayField>` fetches *all* the related fields, and puts them all in a `ListContext`. If a record has a large number of related records, it my be a good idea to limit the number of displayed records. The `perPage` prop allows to create a client-side pagination for the related records.

For instance, to limit the display of related records to 10, you can use the following code:

```jsx
 <ReferenceArrayField label="Tags" source="tag_ids" reference="tags" perPage={10}>
   ...
</ReferenceArrayField>
```

If you want to let the user display the remaining records, you have to pass a [`pagination`](#pagination) element.

## `reference`

The resource to fetch for the relateds record.

For instance, if the `posts` resource has a `tag_ids` field, set the `reference` to `tags` to fetch the tags related to each post.

```jsx
<ReferenceArrayField label="Tags" source="tag_ids" reference="tags">
    <SingleFieldList>
        <ChipField source="name" />
    </SingleFieldList>
</ReferenceField>
```

## `sort`

By default, the related records are displayed in the order in which they appear in the `source`. For instance, if the current record is `{ id: 1234, title: 'Lorem Ipsum', tag_ids: [1, 23, 4] }`, a `<ReferenceArrayField>` on the `tag_ids` field will display tags in the order 1, 23, 4.

`<ReferenceArrayField>` can force a different order (via a client-side sort after fetch) if you specify a `sort` prop.

For instance, to sort tags by title in ascending order, you can use the following code:

{% raw %}
```jsx
<ReferenceArrayField 
    label="Tags"
    source="tag_ids"
    reference="tags"
    sort={{ field: 'title', order: 'ASC' }}
>
    <SingleFieldList>
        <ChipField source="name" />
    </SingleFieldList>
</ReferenceField>
```
{% endraw %}

## `sx`: CSS API

The `<ReferenceArrayField>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                           | Description                                                                              |
|-------------------------------------|------------------------------------------------------------------------------------------|
| `& .RaReferenceArrayField-progress` | Applied to the MUI's `LinearProgress` component while `isLoading` prop is `true` |

To override the style of all instances of `<ReferenceArrayField>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaReferenceArrayField` key.

## Example With A `<Datagrid>` Child

In an Edit of Show view, you can combine `<ReferenceArrayField>` with `<Datagrid>` to display related resources in a table. For instance, to display more details about the tags related to a post in the `PostShow` view:

```jsx
import * as React from "react";
import { Show, SimpleShowLayout, TextField, ReferenceArrayField, Datagrid, ShowButton } from 'react-admin';

export const PostShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceArrayField label="Tags" reference="tags" source="tag_ids">
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" />
                    <ShowButton />
                </Datagrid>
            </ReferenceArrayField>
            <EditButton />
        </SimpleShowLayout>
    </Show>
);
```
