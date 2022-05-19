---
layout: default
title: "The ReferenceManyField Component"
---

# `<ReferenceManyField>`

`<ReferenceManyField>` is useful for displaying one-to-many relationships, when the foreign key is carried by the referenced resource. For instance, if a `user` has many `books` and the `books` resource exposes a `user_id` field, `<ReferenceManyField>` can fetch all the books authored by a given user.

This component fetches a list of referenced records by a reverse lookup of the current `record.id` in the `target` field of another resource (using the `dataProvider.getManyReference()` REST method), and passes them to its child. The child must be an iterator component (like `<SingleFieldList>` or `<Datagrid>`), which usually has one or more child `<Field>` components.

For instance, here is how to show the authors of the comments related to each post in a list by matching `post.id` to `comment.post_id`. We're using `<SingleFieldList>` to display an inline list using only one field for each of the referenced record:

```jsx
import * as React from "react";
import { List, Datagrid, ChipField, ReferenceManyField, SingleFieldList, TextField } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" type="email" />
            <ReferenceManyField label="Comments by" reference="comments" target="post_id">
                <SingleFieldList>
                    <ChipField source="author.name" />
                </SingleFieldList>
            </ReferenceManyField>
            <EditButton />
        </Datagrid>
    </List>
);
```

![ReferenceManyFieldSingleFieldList](./img/reference-many-field-single-field-list.png)

## Properties

| Prop         | Required | Type               | Default                          | Description                                                                         |
| ------------ | -------- | ------------------ | -------------------------------- | ----------------------------------------------------------------------------------- |
| `children`   | Required | `Element`          | -                                | The Iterator element used to render the referenced records                          |
| `reference`  | Required | `string`           | -                                | The name of the resource for the referenced records, e.g. 'books'                   |
| `target`     | Required | string             | -                                | Target field carrying the relationship on the referenced resource, e.g. 'user_id'   |
| `filter`     | Optional | `Object`           | -                                | Filters to use when fetching the related records, passed to `getManyReference()`    |
| `pagination` | Optional | `Element`          | -                                | Pagination element to display pagination controls. empty by default (no pagination) |
| `perPage`    | Optional | `number`           | 25                               | Maximum number of referenced records to fetch                                       |
| `sort`       | Optional | `{ field, order }` | `{ field: 'id', order: 'DESC' }` | Sort order to use when fetching the related records, passed to `getManyReference()` |

`<ReferenceManyField>` also accepts the [common field props](./Fields.md#common-field-props), except `emptyText` (use the child `empty` prop instead).

## Usage

`<ReferenceManyField>` accepts a `reference` attribute, which specifies the resource to fetch for the related record. It also accepts a `source` attribute which defines the field containing the value to look for in the `target` field of the referenced resource. By default, this is the `id` of the resource (`post.id` in the previous example).

**Note**: You **must** add a `<Resource>` for the reference resource - react-admin needs it to fetch the reference data. You *can* omit the `list` prop in this reference if you want to hide it in the sidebar menu.

You can use a `<Datagrid>` instead of a `<SingleFieldList>` - but not inside another `<Datagrid>`! This is useful if you want to display a read-only list of related records. For instance, if you want to show the `comments` related to a `post` in the post's `<Show>` view:

```jsx
import * as React from 'react';
import { ReferenceManyField, Datagrid, DateField, EditButton, Show, SimpleShowLayout, TextField } from "react-admin";

const PostShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="title" />
      <TextField source="teaser" />
      <ReferenceManyField
        reference="comments"
        target="post_id"
        label="Comments"
      >
        <Datagrid>
          <DateField source="created_at" />
          <TextField source="author.name" />
          <TextField source="body" />
          <EditButton />
        </Datagrid>
      </ReferenceManyField>
      <DateField source="published_at" />
    </SimpleShowLayout>
  </Show>
);
```

![ReferenceManyFieldDatagrid](./img/reference-many-field-datagrid.png)

By default, react-admin restricts the possible values to 25 and displays no pagination control. You can change the limit by setting the `perPage` prop:

```jsx
<ReferenceManyField perPage={10} reference="comments" target="post_id">
   ...
</ReferenceManyField>
```

And if you want to allow users to paginate the list, pass a `<Pagination>` element as the `pagination` prop:

```jsx
import { Pagination } from 'react-admin';

<ReferenceManyField pagination={<Pagination />} reference="comments" target="post_id">
   ...
</ReferenceManyField>
```

By default, it orders the possible values by id desc. You can change this order by setting the `sort` prop (an object with `field` and `order` properties).

{% raw %}
```jsx
<ReferenceManyField sort={{ field: 'created_at', order: 'DESC' }} reference="comments" target="post_id">
   ...
</ReferenceManyField>
```
{% endraw %}

Also, you can filter the query used to populate the possible values. Use the `filter` prop for that.

{% raw %}
```jsx
<ReferenceManyField filter={{ is_published: true }} reference="comments" target="post_id">
   ...
</ReferenceManyField>
```
{% endraw %}
