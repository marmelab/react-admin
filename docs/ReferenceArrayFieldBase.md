---
layout: default
title: "The ReferenceArrayFieldBase Component"
storybook_path: ra-core-fields-referencearrayfieldbase--basic
---

# `<ReferenceArrayFieldBase>`

Use `<ReferenceArrayFieldBase>` to display a list of related records, via a one-to-many relationship materialized by an array of foreign keys.

`<ReferenceArrayFieldBase>` fetches a list of referenced records (using the `dataProvider.getMany()` method), and puts them in a [`ListContext`](./useListContext.md). This component is headless, and its children need to use the data from this context to render the desired ui.

**Tip**: For a rendering a list of chips by default, use [the `<ReferenceArrayField>` component](./ReferenceArrayField.md) instead.

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

In that case, use `<ReferenceArrayFieldBase>` to display the post tag names as a list of chips, as follows:

```jsx
import { ListBase, WithListContext, ReferenceArrayFieldBase, RecordContextProvider } from 'react-admin';

export const PostList = () => (
    <ListBase>
        <WithListContext
            render={({ data, isPending }) => (
                <>
                    {!isPending &&
                        data.map(record => (
                            <RecordContextProvider
                                value={record}
                                key={record.id}
                            >
                                <ReferenceArrayFieldBase reference="tags" source="tag_ids">
                                    <TagList />
                                </ReferenceArrayFieldBase>
                            </RecordContextProvider>
                        ))}
                </>
            )}
        />
    </ListBase>
);

const TagList = (props: { children: React.ReactNode }) => {
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

`<ReferenceArrayFieldBase>` expects a `reference` attribute, which specifies the resource to fetch for the related records. It also expects a `source` attribute, which defines the field containing the list of ids to look for in the referenced resource.

`<ReferenceArrayFieldBase>` fetches the `tag` resources related to each `post` resource by matching `post.tag_ids` to `tag.id`.

You can change how the list of related records is rendered by passing a custom child reading the `ListContext` (e.g. a [`<DataTable>`](./DataTable.md)) or a render function prop. See the [`children`](#children) and the [`render`](#render) sections for details.

## Props

| Prop           | Required | Type                                                                              | Default                          | Description                                                                                            |
| -------------- | -------- | --------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `source`       | Required | `string`                                                                          | -                                | Name of the property to display                                                                        |
| `reference`    | Required | `string`                                                                          | -                                | The name of the resource for the referenced records, e.g. 'tags'                                       |
| `children`     | Optional\* | `Element`                                                                         |               | One or several elements that render a list of records based on a `ListContext`                         |
| `render`     | Optional\* | `(ListContext) => Element`                                                                         |               | A function that takes a list context and renders a list of records                        |
| `filter`       | Optional | `Object`                                                                          | -                                | Filters to use when fetching the related records (the filtering is done client-side)                   |
| `offline`      | Optional | `ReactNode`                                                              |              | The component to render when there is no connectivity and the record isn't in the cache |
| `perPage`      | Optional | `number`                                                                          | 1000                             | Maximum number of results to display                                                                   |
| `queryOptions` | Optional | [`UseQuery Options`](https://tanstack.com/query/v5/docs/react/reference/useQuery) | `{}`                             | `react-query` options for the `getMany` query                                                                           |
| `sort`         | Optional | `{ field, order }`                                                                | `{ field: 'id', order: 'DESC' }` | Sort order to use when displaying the related records (the sort is done client-side)                   |
| `sortBy`       | Optional | `string | Function`                                                               | `source`                         | When used in a `List`, name of the field to use for sorting when the user clicks on the column header. |

\* Either one of children or render is required.

## `children`

You can pass any React component as child, to render the list of related records based on the `ListContext`.

```jsx
<ReferenceArrayFieldBase label="Tags" reference="tags" source="tag_ids">
    <TagList />
</ReferenceArrayFieldBase>

const TagList = (props: { children: React.ReactNode }) => {
    const { isPending, error, data } = useListContext();

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error">{error.toString()}</p>;
    }
    return (
        <p>
            {data?.map((tag, index) => (
                <li key={index}>{tag.name}</li>
            ))}
        </p>
    );
};
```

## `render`

Alternatively to `children`, you can pass a `render` function prop to `<ReferenceArrayFieldBase>`. The `render` prop will receive the `ListContext` as its argument, allowing to inline the rendering logic.


```jsx
<ReferenceArrayFieldBase
    label="Tags"
    reference="tags"
    source="tag_ids"
    render={({ isPending, error, data }) => {
        if (isPending) {
            return <p>Loading...</p>;
        }
        if (error) {
            return <p className="error">{error.toString()}</p>;
        }
        return (
            <p>
                {data.map((tag, index) => (
                    <li key={index}>{tag.name}</li>
                ))}
            </p>
        );
    }}
/>
```

**Tip**: When receiving a `render` prop, the `<ReferenceArrayFieldBase>` component will ignore the `children` property.

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

## `offline`

By default, `<ReferenceArrayFieldBase>` renders nothing when there is no connectivity and the records haven't been cached yet. You can provide your own component via the `offline` prop:

```jsx
import { ReferenceArrayFieldBase, ShowBase } from 'ra-core';

export const PostShow = () => (
    <ShowBase>
        <ReferenceArrayFieldBase
            source="tag_ids"
            reference="tags"
            offline={<p>No network. Could not load the tags.</p>}
        >
            ...
        </ReferenceArrayFieldBase>
    </ShowBase>
);
```

**Tip**: If the records are in the Tanstack Query cache but you want to warn the user that they may see an outdated version, you can use the `<IsOffline>` component:

```jsx
import { IsOffline, ReferenceArrayFieldBase, ShowBase } from 'ra-core';

export const PostShow = () => (
    <ShowBase>
        <ReferenceArrayFieldBase
            source="tag_ids"
            reference="tags"
            offline={<p>No network. Could not load the tags.</p>}
        >
            <IsOffline>
                <p>
                    You are offline, tags may be outdated
                </p>
            </IsOffline>
            ...
        </ReferenceArrayFieldBase>
    </ShowBase>
);
```

## `perPage`

`<ReferenceArrayFieldBase>` fetches *all* the related fields, and puts them all in a `ListContext`. If a record has a large number of related records, it may be a good idea to limit the number of displayed records. The `perPage` prop allows to create a client-side pagination for the related records.

For instance, to limit the display of related records to 10, you can use the following code:

```jsx
 <ReferenceArrayFieldBase label="Tags" source="tag_ids" reference="tags" perPage={10} />
```

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
