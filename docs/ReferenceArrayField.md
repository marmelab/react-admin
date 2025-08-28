---
layout: default
title: "The ReferenceArrayField Component"
storybook_path: ra-ui-materialui-fields-referencearrayfield--basic
---

# `<ReferenceArrayField>`

Use `<ReferenceArrayField>` to display a list of related records, via a one-to-many relationship materialized by an array of foreign keys.

<iframe src="https://www.youtube-nocookie.com/embed/UeM31-65Wc4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

`<ReferenceArrayField>` fetches a list of referenced records (using the `dataProvider.getMany()` method), and puts them in a [`ListContext`](./useListContext.md). It then renders each related record, using its [`recordRepresentation`](./Resource.md#recordrepresentation), in a [`<ChipField>`](./ChipField.md). 

**Tip**: If the relationship is materialized by a foreign key on the referenced resource, use [the `<ReferenceManyField>` component](./ReferenceManyField.md) instead.

**Tip**: To edit the records of a one-to-many relationship, use [the `<ReferenceArrayInput>` component](./ReferenceArrayInput.md).

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

In that case, use `<ReferenceArrayField>` to display the post tag names as Chips as follows:

```jsx
import { List, DataTable, ReferenceArrayField } from 'react-admin';

export const PostList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="tag_ids" label="Tags">
                <ReferenceArrayField reference="tags" source="tag_ids" />
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);
```

![ReferenceArrayField](./img/reference-array-field.png)

`<ReferenceArrayField>` expects a `reference` attribute, which specifies the resource to fetch for the related records. It also expects a `source` attribute, which defines the field containing the list of ids to look for in the referenced resource.

`<ReferenceArrayField>` fetches the `tag` resources related to each `post` resource by matching `post.tag_ids` to `tag.id`. By default, it renders one string by related record, via a [`<SingleFieldList>`](./SingleFieldList.md) with a [`<ChipField>`](./ChipField.md) child using the resource [`recordRepresentation`](./Resource.md#recordrepresentation) as source

Configure the `<Resource recordRepresentation>` to render related records in a meaningful way. For instance, for the `tags` resource, if you want the `<ReferenceArrayField>` to display the tag `name`:

```jsx
<Resource name="tags" list={TagList} recordRepresentation="name" />
```

You can change how the list of related records is rendered by passing a custom child reading the `ListContext` (e.g. a [`<DataTable>`](./DataTable.md)). See the [`children`](#children) section for details.

## Props

| Prop           | Required | Type                                                                              | Default                          | Description                                                                                            |
| -------------- | -------- | --------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `source`       | Required | `string`                                                                          | -                                | Name of the property to display                                                                        |
| `reference`    | Required | `string`                                                                          | -                                | The name of the resource for the referenced records, e.g. 'tags'                                       |
| `children`     | Optional&nbsp;* | `ReactNode`                                                                         | `<SingleFieldList>`              | One or several elements that render a list of records based on a `ListContext`                         |
| `render`     | Optional&nbsp;* | `(listContext) => Element`                                                                         | `<SingleFieldList>`              | A function that takes a list context and render a list of records                         |
| `filter`       | Optional | `Object`                                                                          | -                                | Filters to use when fetching the related records (the filtering is done client-side)                   |
| `offline`      | Optional | `ReactNode`                                                              | `<Offline variant="inline" />` | The component to render when there is no connectivity and the record isn't in the cache |
| `pagination`   | Optional | `ReactNode`                                                                         | -                                | Pagination element to display pagination controls. empty by default (no pagination)                    |
| `perPage`      | Optional | `number`                                                                          | 1000                             | Maximum number of results to display                                                                   |
| `queryOptions` | Optional | [`UseQuery Options`](https://tanstack.com/query/v5/docs/react/reference/useQuery) | `{}`                             | `react-query` options for the `getMany` query                                                                           |
| `sort`         | Optional | `{ field, order }`                                                                | `{ field: 'id', order: 'DESC' }` | Sort order to use when displaying the related records (the sort is done client-side)                   |
| `sortBy`       | Optional | `string | Function`                                                               | `source`                         | When used in a `List`, name of the field to use for sorting when the user clicks on the column header. |

`*` You must provide either `children` or `render`.

`<ReferenceArrayField>` also accepts the [common field props](./Fields.md#common-field-props), except `emptyText` (use the child `empty` prop instead).

## `children`

By default, `<ReferenceArrayField>` renders one string by related record, via a [`<SingleFieldList>`](./SingleFieldList.md) with a [`<ChipField>`](./ChipField.md) using the resource [`recordRepresentation`](./Resource.md#recordrepresentation). 

![ReferenceArrayField with default children](./img/ReferenceArrayField-default-child.png)

You can pass any component of your own as child, to render the list of related records in another way.

That means that using the field without child:

```jsx
<ReferenceArrayField label="Tags" reference="tags" source="tag_ids" />
```

Is equivalent to:

```jsx
<ReferenceArrayField label="Tags" reference="tags" source="tag_ids">
    <SingleFieldList>
        <ChipField source="name" />
    </SingleFieldList>
</ReferenceArrayField>
```

`<ReferenceArrayField>` creates a [`ListContext`](./useListContext.md), so you can use any child that uses a `ListContext`:

- [`<SingleFieldList>`](./SingleFieldList.md)
- [`<DataTable>`](./DataTable.md)
- [`<Datagrid>`](./Datagrid.md)
- [`<SimpleList>`](./SimpleList.md)
- [`<EditableDatagrid>`](./EditableDatagrid.md)
- [`<Calendar>`](./Calendar.md)
- Or a component of your own (check the [`<WithListContext>`](./WithListContext.md) and the [`useListContext`](./useListContext.md) chapters to learn how). 

For instance, use a `<DataTable>` to render the related records in a table:

```jsx
import { Show, SimpleShowLayout, TextField, ReferenceArrayField, DataTable, ShowButton } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceArrayField label="Tags" reference="tags" source="tag_ids">
                <DataTable>
                    <DataTable.Col source="id" />
                    <DataTable.Col source="name" />
                    <DataTable.Col>
                        <ShowButton />
                    </DataTable.Col>
                </DataTable>
            </ReferenceArrayField>
            <EditButton />
        </SimpleShowLayout>
    </Show>
);
```

Alternatively, you can use [the `render` prop](#render) to render the related records in a custom way:

```tsx
import { Show, SimpleShowLayout, TextField, ReferenceArrayField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceArrayField
                label="Tags"
                reference="tags"
                source="tag_ids"
                render={({ data }) => (
                    <ul>
                        {data?.map(tag => (
                            <li key={tag.id}>{tag.name}</li>
                        ))}
                    </ul>
                )}
            />
            <EditButton />
        </SimpleShowLayout>
    </Show>
);
```

## `filter`

`<ReferenceArrayField>` fetches all the related records, and displays them all, too. You can use the `filter` prop to filter the list of related records to display (this works by filtering the records client-side, after the fetch).
                )} />
            <EditButton />
        </SimpleShowLayout>
    </Show>
);
```

## `filter`

`<ReferenceArrayField>` fetches all the related records, and displays them all, too. You can use the `filter` prop to filter the list of related records to display (this works by filtering the records client-side, after the fetch).

For instance, to render only tags that are 'published', you can use the following code:

{% raw %}
```jsx
<ReferenceArrayField 
    label="Tags"
    source="tag_ids"
    reference="tags"
    filter={{ is_published: true }}
/>
```
{% endraw %}

## `label`

By default, `<SimpleShowLayout>`, `<Datagrid>` and other layout components infer the label of a field based on its `source`. For a `<ReferenceArrayField>`, this may not be what you expect:

```jsx
{/* default label is 'Tag Ids', or the translation of 'resources.posts.fields.tag_ids' if it exists */}
<ReferenceArrayField source="tag_ids" reference="tags" />
```

That's why you often need to set an explicit `label` on a `<ReferenceField>`:

```jsx
<ReferenceArrayField label="Tags" source="tag_ids" reference="tags" />
```

**Tip**: Having to specify the `label` prop on the field for it to be used by the Datagrid is no longer necessary with [`<DataTable>`](./DataTable.md), the successor of the `<Datagrid>` component. Instead, `<DataTable>` properly separates the props for the column header and the field itself, thanks to the [`<DataTable.Col>`](./DataTable.md#datatablecol) component.

React-admin uses [the i18n system](./Translation.md) to translate the label, so you can use translation keys to have one label for each language supported by the interface:

```jsx
<ReferenceArrayField label="resource.posts.fields.tags" source="tag_ids" reference="tags" />
```

## `offline`

By default, `<ReferenceArrayField>` renders the `<Offline variant="inline">` when there is no connectivity and the records haven't been cached yet. You can provide your own component via the `offline` prop:

```jsx
import { ReferenceArrayField, Show } from 'react-admin';
import { Alert } from '@mui/material';

export const PostShow = () => (
    <Show>
        <ReferenceArrayField
            source="tag_ids"
            reference="tags"
            offline={<Alert severity="warning">No network. Could not load the tags.</Alert>}
        >
            ...
        </ReferenceArrayField>
    </Show>
);
```

**Tip**: If the records are in the Tanstack Query cache but you want to warn the user that they may see an outdated version, you can use the `<IsOffline>` component:

```jsx
import { IsOffline, ReferenceArrayField, Show } from 'react-admin';
import { Alert } from '@mui/material';

export const PostShow = () => (
    <Show>
        <ReferenceArrayField source="tag_ids" reference="tags">
            <IsOffline>
                <Alert severity="warning">
                    You are offline, tags may be outdated
                </Alert>
            </IsOffline>
            ...
        </ReferenceArrayField>
    </Show>
);
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
    pagination={<Pagination />}
/>
```

## `perPage`

`<ReferenceArrayField>` fetches *all* the related fields, and puts them all in a `ListContext`. If a record has a large number of related records, it may be a good idea to limit the number of displayed records. The `perPage` prop allows to create a client-side pagination for the related records.

For instance, to limit the display of related records to 10, you can use the following code:

```jsx
 <ReferenceArrayField label="Tags" source="tag_ids" reference="tags" perPage={10} />
```

If you want to let the user display the remaining records, you have to pass a [`pagination`](#pagination) element.

## `queryOptions`

Use the `queryOptions` prop to pass options to [the `dataProvider.getMany()` query](./useGetOne.md#aggregating-getone-calls) that fetches the referenced record.

For instance, to pass [a custom `meta`](./Actions.md#meta-parameter):

{% raw %}
```jsx
<ReferenceArrayField queryOptions={{ meta: { foo: 'bar' } }} />
```
{% endraw %}

## `render`

Alternatively to `children`, you can pass a `render` prop to `<ReferenceArrayField>`. It will receive the [`ListContext`](./useListContext.md#return-value) as its argument, and should return a React node.

This allows to inline the render logic for the list of related records.

```jsx
<ReferenceArrayField
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
            <ul>
                {data.map((tag, index) => (
                    <li key={index}>{tag.name}</li>
                ))}
            </ul>
        );
    }}
/>
```

## `reference`

The resource to fetch for the relateds record.

For instance, if the `posts` resource has a `tag_ids` field, set the `reference` to `tags` to fetch the tags related to each post.

```jsx
<ReferenceArrayField label="Tags" source="tag_ids" reference="tags" />
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
/>
```
{% endraw %}

## `sx`: CSS API

The `<ReferenceArrayField>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (see [the `sx` documentation](./SX.md) for syntax and examples). This property accepts the following subclasses:

| Rule name                           | Description                                                                              |
|-------------------------------------|------------------------------------------------------------------------------------------|
| `& .RaReferenceArrayField-progress` | Applied to the Material UI's `LinearProgress` component while `isPending` prop is `true` |

To override the style of all instances of `<ReferenceArrayField>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaReferenceArrayField` key.

