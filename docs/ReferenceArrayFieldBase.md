---
layout: default
title: "The ReferenceArrayFieldBase Component"
storybook_path: ra-ui-materialui-fields-referencearrayfieldbase--basic
---

# `<ReferenceArrayFieldBase>`

Use `<ReferenceArrayFieldBase>` to display a list of related records, via a one-to-many relationship materialized by an array of foreign keys.

`<ReferenceArrayFieldBase>` fetches a list of referenced records (using the `dataProvider.getMany()` method), and puts them in a [`ListContext`](./useListContext.md). This component is headless, and its children need to use the data from this context to render the desired ui.
For a component handling the UI too use [the `<ReferenceArrayField>` component](./ReferenceArrayField.md) instead.

**Tip**: If the relationship is materialized by a foreign key on the referenced resource, use [the `<ReferenceManyFieldBase>` component](./ReferenceManyFieldBase.md) instead.

## Usage

For instance, let's consider a model where a `post` has many `tags`, materialized to a `tags_ids` field containing an array of ids:

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

A typical `post` record therefore looks like this:

```json
{
  "id": 1,
  "title": "Hello world",
  "body": "...",
  "is_published": true,
  "tags_ids": [1, 2, 3]
}
```

In that case, use `<ReferenceArrayFieldBase>` to display the post tag names as Chips as follows:

```jsx
import { List, DataTable, ReferenceArrayFieldBase } from 'react-admin';

const MyPostView = (props: { children: React.ReactNode }) => {
    const context = useListContext();

    if (context.isPending) {
        return <p>Loading...</p>;
    }

    if (context.error) {
        return <p className="error">{context.error.toString()}</p>;
    }
    return (
        <p>
            {listContext.data?.map((tag, index) => (
                <li key={index}>{tag.name}</li>
            ))}
        </p>
    );
};

export const PostList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="tag_ids" label="Tags">
                <ReferenceArrayFieldBase reference="tags" source="tag_ids">
                    <MyPostView />
                </ReferenceArrayFieldBase>
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);
```

`<ReferenceArrayFieldBase>` expects a `reference` attribute, which specifies the resource to fetch for the related records. It also expects a `source` attribute, which defines the field containing the list of ids to look for in the referenced resource.

`<ReferenceArrayFieldBase>` fetches the `tag` resources related to each `post` resource by matching `post.tag_ids` to `tag.id`.

You can change how the list of related records is rendered by passing a custom child reading the `ListContext` (e.g. a [`<DataTable>`](./DataTable.md)). See the [`children`](#children) section for details.

## Props

| Prop           | Required | Type                                                                              | Default                          | Description                                                                                            |
| -------------- | -------- | --------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `source`       | Required | `string`                                                                          | -                                | Name of the property to display                                                                        |
| `reference`    | Required | `string`                                                                          | -                                | The name of the resource for the referenced records, e.g. 'tags'                                       |
| `children`     | Required if no render | `Element`                                                                         |               | One or several elements that render a list of records based on a `ListContext`                         |
| `render`     | Required if no children | `Element`                                                                         |               | A function that takes a list context and render a list of records                        |
| `filter`       | Optional | `Object`                                                                          | -                                | Filters to use when fetching the related records (the filtering is done client-side)                   |
| `pagination`   | Optional | `Element`                                                                         | -                                | Pagination element to display pagination controls. empty by default (no pagination)                    |
| `perPage`      | Optional | `number`                                                                          | 1000                             | Maximum number of results to display                                                                   |
| `queryOptions` | Optional | [`UseQuery Options`](https://tanstack.com/query/v5/docs/react/reference/useQuery) | `{}`                             | `react-query` options for the `getMany` query                                                                           |
| `sort`         | Optional | `{ field, order }`                                                                | `{ field: 'id', order: 'DESC' }` | Sort order to use when displaying the related records (the sort is done client-side)                   |
| `sortBy`       | Optional | `string | Function`                                                               | `source`                         | When used in a `List`, name of the field to use for sorting when the user clicks on the column header. |

## `children`

You can pass any component of your own as child, to render the list of related records as you wish.
You can access the list context using the `useListContext` hook.


```jsx

<ReferenceArrayFieldBase label="Tags" reference="tags" source="tag_ids">
    <MyPostView />
</ReferenceArrayFieldBase>

// With MyPostView like:
const MyPostView = (props: { children: React.ReactNode }) => {
    const context = useListContext();

    if (context.isPending) {
        return <p>Loading...</p>;
    }

    if (context.error) {
        return <p className="error">{context.error.toString()}</p>;
    }
    return (
        <p>
            {listContext.data?.map((tag, index) => (
                <li key={index}>{tag.name}</li>
            ))}
        </p>
    );
};
```

## `render`

Alternatively to children you can pass a render prop to `<ReferenceArrayFieldBase>`. The render prop will receive the list context as its argument, allowing to inline the render logic for both the list and the pagination.
When receiving a render prop the `<ReferenceArrayFieldBase>` component will ignore the children and the pagination property.


```jsx
<ReferenceArrayFieldBase 
    label="Tags"
    reference="tags"
    source="tag_ids"
    render={(context) => {

        if (context.isPending) {
            return <p>Loading...</p>;
        }

        if (context.error) {
            return <p className="error">{context.error.toString()}</p>;
        }
        return (
            <p>
                {listContext.data?.map((tag, index) => (
                    <li key={index}>{tag.name}</li>
                ))}
            </p>
        );
    }}
/>
```

## `filter`

`<ReferenceArrayFieldBase>` fetches all the related records, and displays them all, too. You can use the `filter` prop to filter the list of related records to display (this works by filtering the records client-side, after the fetch).

For instance, to render only tags that are 'published', you can use the following code:

{% raw %}
```jsx
<ReferenceArrayFieldBase 
    label="Tags"
    source="tag_ids"
    reference="tags"
    filter={{ is_published: true }}
/>
```
{% endraw %}

## `pagination`

`<ReferenceArrayFieldBase>` fetches *all* the related fields, and puts them all in a `ListContext`. If a record has a large number of related records, you can limit the number of displayed records with the [`perPage`](#perpage) prop. Then, let users display remaining records by rendering pagination controls. For that purpose, pass a pagination element to the `pagination` prop.

For instance, to limit the display of related records to 10, you can use the following code:

```jsx
import { Pagination, ReferenceArrayFieldBase } from 'react-admin';

<ReferenceArrayFieldBase
    label="Tags"
    source="tag_ids"
    reference="tags"
    perPage={10}
    pagination={<Pagination />}
/>
```

***Note:*** The pagination prop will be ignored when the component receive a render prop

## `perPage`

`<ReferenceArrayFieldBase>` fetches *all* the related fields, and puts them all in a `ListContext`. If a record has a large number of related records, it may be a good idea to limit the number of displayed records. The `perPage` prop allows to create a client-side pagination for the related records.

For instance, to limit the display of related records to 10, you can use the following code:

```jsx
 <ReferenceArrayFieldBase label="Tags" source="tag_ids" reference="tags" perPage={10} />
```

If you want to let the user display the remaining records, you have to pass a [`pagination`](#pagination) element.

## `queryOptions`

Use the `queryOptions` prop to pass options to [the `dataProvider.getMany()` query](./useGetOne.md#aggregating-getone-calls) that fetches the referenced record.

For instance, to pass [a custom `meta`](./Actions.md#meta-parameter):

{% raw %}
```jsx
<ReferenceArrayFieldBase queryOptions={{ meta: { foo: 'bar' } }} />
```
{% endraw %}


## `reference`

The resource to fetch for the relateds record.

For instance, if the `posts` resource has a `tag_ids` field, set the `reference` to `tags` to fetch the tags related to each post.

```jsx
<ReferenceArrayFieldBase label="Tags" source="tag_ids" reference="tags" />
```

## `sort`

By default, the related records are displayed in the order in which they appear in the `source`. For instance, if the current record is `{ id: 1234, title: 'Lorem Ipsum', tag_ids: [1, 23, 4] }`, a `<ReferenceArrayFieldBase>` on the `tag_ids` field will display tags in the order 1, 23, 4.

`<ReferenceArrayFieldBase>` can force a different order (via a client-side sort after fetch) if you specify a `sort` prop.

For instance, to sort tags by title in ascending order, you can use the following code:

{% raw %}
```jsx
<ReferenceArrayFieldBase 
    label="Tags"
    source="tag_ids"
    reference="tags"
    sort={{ field: 'title', order: 'ASC' }}
/>
```
{% endraw %}
