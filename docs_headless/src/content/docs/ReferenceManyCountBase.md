---
title: "<ReferenceManyCountBase>"
---

When you need to render the number of records related to another record via a one-to-many relationship (e.g. the number of comments related to a post), use the `<ReferenceManyCountBase>` component. It calls `dataProvider.getManyReference()` with the `pagination` parameter set to retrieve no data - only the total number of records.

## Usage

Use `<ReferenceManyCountBase>` anywhere inside a [`RecordContext`](./useRecordContext.md). You must set the `reference` and `target` props to match the relationship:

- `reference` is the name of the related resource to fetch (e.g. `comments`)
- `target` is the name of the field in the related resource that points to the current resource (e.g. `post_id`)

For instance, to display the number of comments related to a post in a List view:

```jsx
import { 
    ListBase,
    ListIterator,
    ReferenceManyCountBase,
} from 'ra-core';
import { TextField } from './TextField';
import { DateField } from './DateField';

export const PostList = () => (
    <ListBase>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Published</th>
                    <th>Nb comments</th>
                </tr>
            </thead>
            <tbody>
                <ListIterator>
                    <tr>
                        <td><TextField source="id" /></td>
                        <td><TextField source="title" /></td>
                        <td><DateField source="published_at" /></td>
                        <td>
                            <ReferenceManyCountBase
                                reference="comments"
                                target="post_id"
                            />
                        </td>
                    </tr>
                </ListIterator>
            </tbody>
        </table>
    </ListBase>
)
```


## Props

| Prop        | Required | Type                                        | Default                          | Description                                                               |
| ----------- | -------- | ------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------- |
| `reference` | Required | string                                      | -                                | Name of the related resource to fetch (e.g. `comments`)                   |
| `target`    | Required | string                                      | -                                | Name of the field in the related resource that points to the current one. |
| `filter`    | Optional | Object                                      | -                                | Filter to apply to the query.                                             |
| `resource`  | Optional | string                                      | -                                | Resource to count. Default to the current `ResourceContext`               |
| `sort`      | Optional | `{ field: string, order: 'ASC' or 'DESC' }` | `{ field: 'id', order: 'DESC' }` | The sort option sent to `getManyReference`                                |
| `timeout`   | Optional | number                                      | 1000                             | Number of milliseconds to wait before displaying the loading indicator.   |


## `filter`

If you want to count the number of records matching a given filter, pass it as the `filter` prop. For example, to count the number of comments already published:

```jsx
<ReferenceManyCountBase 
    label="Comments"
    reference="comments"
    target="post_id"
    filter={{ is_published: true }}
/>
```

## `reference`

The `reference` prop is required and must be the name of the related resource to fetch. For instance, to fetch the number of comments related to the current post:

```jsx
<ReferenceManyCountBase 
    label="Comments"
    reference="comments"
    target="post_id"
/>
```

## `resource`

By default, the `<ReferenceManyCountBase>` component uses the current `ResourceContext`, so you don't need to pass the `resource` prop to count the number of records in the current Resource. If you want to count a different resource, pass it as the `resource` prop.

```jsx
<ReferenceManyCountBase 
    label="Comments"
    reference="comments"
    target="post_id"
    resource="posts"
/>
```

## `sort`

If you want to customize the sort options passed to `getManyReference` (for instance because your relation table does not have an `id` column), you can pass a custom `sort` prop:

```jsx
<ReferenceManyCountBase 
    label="Comments"
    reference="comments"
    target="post_id"
    sort={{ field: 'custom_id', order: 'ASC' }}
/>
```

## `target`

The `target` prop is required and must be the name of the field in the related resource that points to the current one. For instance, when fetching the number of comments related to the current post, if a comment relates to a post via a `post_id` foreign key, you must set the `target` prop to `post_id`:

```jsx
<ReferenceManyCountBase 
    label="Comments"
    reference="comments"
    target="post_id"
/>
```

## `timeout`

The `<ReferenceManyCountBase>` component displays a loading indicator after 1 second. This is useful to avoid displaying a loading indicator when the count is retrieved in a few milliseconds. You can change this delay by passing a `timeout` prop.

```jsx
<ReferenceManyCountBase 
    label="Comments"
    reference="comments"
    target="post_id"
    timeout={500}
/>
```
