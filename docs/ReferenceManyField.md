---
layout: default
title: "The ReferenceManyField Component"
---

# `<ReferenceManyField>`

`<ReferenceManyField>` is useful for displaying a list of related records via a one-to-many relationship, when the foreign key is carried by the referenced resource. 

![referenceManyField](./img/reference_many_field.png)

For instance, if an `author` has many `books`, and each book resource exposes an `author_id` field:

```
┌────────────────┐       ┌──────────────┐
│ authors        │       │ books        │
│----------------│       │--------------│
│ id             │───┐   │ id           │
│ first_name     │   └──╼│ author_id    │
│ last_name      │       │ title        │
│ date_of_birth  │       │ published_at │
└────────────────┘       └──────────────┘
```

`<ReferenceManyField>` can render the titles of all the books by a given author.

```jsx
const AuthorShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <ReferenceManyField label="Books" reference="books" target="author_id">
              <Datagrid>
                <TextField source="title" />
                <DateField source="published_at" />
              </Datagrid>
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
);
```

This component fetches a list of referenced records by a reverse lookup of the current `record.id` in the `target` field of another resource (using the `dataProvider.getManyReference()` REST method), and puts them in a [`ListContext`](./useListContext.md). Its children can then use the data from this context. The most common case is to use [`<SingleFieldList>`](./SingleFieldList.md) or [`<Datagrid>`](./Datagrid.md) as child.

**Tip**: If the relationship is materialized by an array of ids in the initial record, use [the `<ReferenceArrayField>` component](./ReferenceArrayField.md) instead.

**Tip**: To edit the records of a one-to-many relationship, use [the `<ReferenceManyInput>` component](./ReferenceManyInput.md).

## Usage

For instance, here is how to show the title of the books written by a particular author in a show view.

```jsx
import { Show, SimpleShowLayout, TextField, ReferenceManyField, Datagrid, DateField } from 'react-admin';

export const AuthorShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="first_name" />
      <TextField source="last_name" />
      <DateField label="Born" source="dob" />
      <ReferenceManyField label="Books" reference="books" target="author_id">
        <Datagrid>
          <TextField source="title" />
          <DateField source="published_at" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
```

`<ReferenceManyField>` accepts a `reference` attribute, which specifies the resource to fetch for the related record. It also accepts a `source` attribute which defines the field containing the value to look for in the `target` field of the referenced resource. By default, this is the `id` of the resource (`authors.id` in the previous example).

You can also use `<ReferenceManyField>` in a list, e.g. to display the authors of the comments related to each post in a list by matching `post.id` to `comment.post_id`:

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

This example leverages [`<SingleFieldList>`](./SingleFieldList.md) to display an inline list using only one field for each of the referenced records.

## Props

| Prop         | Required | Type      | Default | Description                                                                         |
| ------------ | -------- | --------- | ------- | ----------------------------------------------------------------------------------- |
| `target`     | Required | `string`  | -       | Target field carrying the relationship on the referenced resource, e.g. 'user_id'   |
| `reference`  | Required | `string`  | -       | The name of the resource for the referenced records, e.g. 'books'                   |
| `children`   | Required | `Element` | -       | One or several elements that render a list of records based on a `ListContext`      |
| `source`     | Optional | `string`  | `id`    | Target field carrying the relationship on the source record (usually 'id')          |
| `filter`     | Optional | `Object`  | -       | Filters to use when fetching the related records, passed to `getManyReference()`    |
| `pagination` | Optional | `Element` | -       | Pagination element to display pagination controls. empty by default (no pagination) |
| `perPage`    | Optional | `number`  | 25      | Maximum number of referenced records to fetch                                       |
| `sort`       | Optional | `{ field, order }` | `{ field: 'id', order: 'DESC' }` | Sort order to use when fetching the related records, passed to `getManyReference()` |

`<ReferenceManyField>` also accepts the [common field props](./Fields.md#common-field-props), except `emptyText` (use the child `empty` prop instead).

## `children`

`<ReferenceManyField>` renders its children inside a [`ListContext`](./useListContext.md). This means you can use any component that uses a `ListContext`:

- [`<SingleFieldList>`](./SingleFieldList.md)
- [`<Datagrid>`](./Datagrid.md)
- [`<SimpleList>`](./SimpleList.md)
- [`<EditableDatagrid>`](./EditableDatagrid.md)
- [`<Calendar>`](./Calendar.md)
- Or a component of your own (check the [`<WithListContext>`](./WithListContext.md) and the [`useListContext`](./useListContext.md) chapters to learn how). 

For instance, use a `<Datagrid>` to render the related records in a table:

```jsx
import { Show, SimpleShowLayout, TextField, ReferenceManyField, Datagrid, DateField } from 'react-admin';

export const AuthorShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="first_name" />
      <TextField source="last_name" />
      <DateField label="Born" source="dob" />
      <ReferenceManyField label="Books" reference="books" target="author_id">
        <Datagrid>
          <TextField source="title" />
          <DateField source="published_at" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
```

Or [`<WithListContext>`](./WithListContext.md) to render the related records in a custom way:

```jsx
import { Show, SimpleShowLayout, TextField, ReferenceManyField, WithListContext, DateField } from 'react-admin';

export const AuthorShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="first_name" />
      <TextField source="last_name" />
      <DateField label="Born" source="dob" />
      <ReferenceManyField label="Books" reference="books" target="author_id">
        <WithListContext render={({ data }) => (
          <ul>
            {data.map(book => (
              <li key={book.id}>{book.title}</li>
            ))}
          </ul>
        )} />
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
```

## `filter`

You can filter the query used to populate the possible values. Use the `filter` prop for that.

{% raw %}
```jsx
<ReferenceManyField
  reference="comments"
  target="post_id"
  filter={{ is_published: true }}
>
   ...
</ReferenceManyField>
```
{% endraw %}

## `label`

By default, `<SimpleShowLayout>`, `<Datagrid>` and other layout components infer the label of a field based on its `source`. For a `<ReferenceManyField>`, the source defaults to `id`, so this may not be what you expect:

```jsx
{/* default label is 'Id', or the translation of 'resources.authors.fields.id' if it exists */}
<ReferenceManyField reference="books" target="author_id">
  <Datagrid>
    <TextField source="title" />
    <DateField source="published_at" />
  </Datagrid>
</ReferenceManyField>
```

That's why you often need to set an explicit `label` on a `<ReferenceField>`:

```jsx
<ReferenceManyField label="Books" reference="books" target="author_id">
  <Datagrid>
    <TextField source="title" />
    <DateField source="published_at" />
  </Datagrid>
</ReferenceManyField>
```

React-admin uses [the i18n system](./Translation.md) to translate the label, so you can use translation keys to have one label for each language supported by the interface:

```jsx
<ReferenceManyField label="resources.authors.fields.books" reference="books" target="author_id">
  <Datagrid>
    <TextField source="title" />
    <DateField source="published_at" />
  </Datagrid>
</ReferenceManyField>
```

## `pagination`

If you want to allow users to paginate the list, pass a `<Pagination>` element as the `pagination` prop:

```jsx
import { Pagination } from 'react-admin';

<ReferenceManyField pagination={<Pagination />} reference="comments" target="post_id">
   ...
</ReferenceManyField>
```

## `perPage`

By default, react-admin restricts the possible values to 25 and displays no pagination control. You can change the limit by setting the `perPage` prop:

```jsx
<ReferenceManyField perPage={10} reference="comments" target="post_id">
   ...
</ReferenceManyField>
```

## `reference`

The name of the resource to fetch for the related records.

For instance, if you want to display the `books` of a given `author`, the `reference` name should be `books`:

```jsx
<ReferenceManyField label="Books" reference="books" target="author_id">
  <Datagrid>
    <TextField source="title" />
    <DateField source="published_at" />
  </Datagrid>
</ReferenceManyField>
```

## `sort`

By default, it orders the possible values by id desc. You can change this order by setting the `sort` prop (an object with `field` and `order` properties).

{% raw %}
```jsx
<ReferenceManyField
  target="post_id"
  reference="comments"
  sort={{ field: 'created_at', order: 'DESC' }}
>
   ...
</ReferenceManyField>
```
{% endraw %}

## `source`

By default, `ReferenceManyField` uses the `id` field as target for the reference. If the foreign key points to another field of your record, you can select it with the `source` prop.

```jsx
<ReferenceManyField
  target="post_id"
  reference="comments"
  source="_id"
>
   ...
</ReferenceManyField>
```

## `target`

Name of the field carrying the relationship on the referenced resource. For instance, if an `author` has many `books`, and each book resource exposes an `author_id` field, the `target` would be `author_id`.

```jsx
<ReferenceManyField label="Books" reference="books" target="author_id">
  <Datagrid>
    <TextField source="title" />
    <DateField source="published_at" />
  </Datagrid>
</ReferenceManyField>
```

## Rendering Only One Record

Although you are in a one-to-many relationship, you may want to render only one record. For instance, in a book with several reviews, you may want to display only the last. Or, for a product with many prices, you may want to display only the one in euros. 

In these cases, use [the `<ReferenceOneField>` component](./ReferenceOneField.md) instead of `<ReferenceManyField>`.

{% raw %}
```jsx
<ReferenceOneField
    label="Latest review"
    reference="book_reviews"
    target="book_id"
    sort={{ field: "createdAt", order: "DESC" }}
>
    <RatingField />
    <TextField source="body" />
</ReferenceOneField>
```
{% endraw %}

{% raw %}
```jsx
<ReferenceOneField
    label="Price (€)"
    reference="product_prices"
    target="product_id"
    filter={{ currency: "EUR" }}
>
    <NumberField source="price" />
</ReferenceOneField>
```
{% endraw %}
