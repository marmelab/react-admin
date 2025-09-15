---
layout: default
title: "The ReferenceFieldBase Component"
storybook_path: ra-core-controller-field-referencefieldbase--basic
---

# `<ReferenceFieldBase>`

`<ReferenceFieldBase>` is useful for displaying many-to-one and one-to-one relationships, e.g. the details of a user when rendering a post authored by that user.
`<ReferenceFieldBase>` is a headless component, handling only the logic. This allows to use any UI library for the render. For a version based on MUI see [`<ReferenceField>`](/ReferenceField.html)

## Usage

For instance, let's consider a model where a `post` has one author from the `users` resource, referenced by a `user_id` field.

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

In that case, use `<ReferenceFieldBase>` to display the post's author as follows:

```jsx
import { Show, SimpleShowLayout, ReferenceField, TextField, RecordRepresentation } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <ReferenceFieldBase source="user_id" reference="users" >
                <UserView />
            </ReferenceFieldBase>
        </SimpleShowLayout>
    </Show>
);

export const UserView = () => {
    const context = useReferenceFieldContext();

    if (context.isPending) {
        return <p>Loading...</p>;
    }

    if (context.error) {
        return <p className="error">{context.error.toString()}</p>;
    }

    return <RecordRepresentation />;
};
```

`<ReferenceFieldBase>` fetches the data, puts it in a [`RecordContext`](./useRecordContext.md), and its up to its children to handle the rendering by accessing the `ReferencingContext` using the `useReferenceFieldContext` hook.

It uses `dataProvider.getMany()` instead of `dataProvider.getOne()` [for performance reasons](#performance). When using several `<ReferenceFieldBase>` in the same page (e.g. in a `<DataTable>`), this allows to call the `dataProvider` once instead of once per row.

## Props

| Prop        | Required | Type                | Default  | Description                                                                                                         |
| ----------- | -------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `source`    | Required | `string`            | -        | Name of the property to display |
| `reference` | Required | `string`            | -        | The name of the resource for the referenced records, e.g. 'posts' |
| `children`  | Optional | `ReactNode`         | -        | React component to render the referenced record. |
| `render`  | Optional |  `(context) => ReactNode`         | -        | Function that takes the referenceFieldContext and renders the referenced record. |
| `empty`     | Optional | `ReactNode`         | -        | What to render when the field has no value or when the reference is missing |
| `offline`   | Optional | `ReactNode`         | -        | What to render when there is no network connectivity when loading the record |
| `queryOptions`     | Optional | [`UseQuery Options`](https://tanstack.com/query/v5/docs/react/reference/useQuery)                       | `{}`                             | `react-query` client options                                                                   |
| `record`    | Optional | `RaRecord` | - | The current record |
| `sortBy`    | Optional | `string | Function` | `source` | Name of the field to use for sorting when used in a Datagrid |

## `children`

You can pass any component of your own as child, to render the related records as you wish.
You can access the list context using the `useReferenceFieldContext` hook.

```tsx
import { ReferenceFieldBase } from 'react-admin';

export const UserView = () => {
    const { error, isPending, referenceRecord } = useReferenceFieldContext();

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error">{error.toString()}</p>;
    }

    return <>{referenceRecord.name}</>;
};

export const MyReferenceField = () => (
    <ReferenceFieldBase source="user_id" reference="users">
        <UserView />
    </ReferenceFieldBase>
);
```

## `empty`

`<ReferenceFieldBase>` can display a custom message when the referenced record is missing, thanks to the `empty` prop.

```jsx
<ReferenceFieldBase source="user_id" reference="users" empty="Missing user" >
    ...
</ReferenceFieldBase>
```

`<ReferenceFieldBase>` renders the `empty` element when:

- the referenced record is missing (no record in the `users` table with the right `user_id`), or
- the field is empty (no `user_id` in the record).

You can pass either a React element or a string to the `empty` prop:

```jsx
<ReferenceFieldBase source="user_id" reference="users" empty={<span>Missing user</span>} >
    ...
</ReferenceFieldBase>
<ReferenceFieldBase source="user_id" reference="users" empty="Missing user" >
    ...
</ReferenceFieldBase>
```

## `offline`

When the user is offline, `<ReferenceFieldBase>` is smart enough to display the referenced record if it was previously fetched. However, if the referenced record has never been fetched before, `<ReferenceFieldBase>` displays an error message explaining that the app has lost network connectivity.

You can customize this error message by passing a React element or a string to the `offline` prop:

```jsx
<ReferenceFieldBase source="user_id" reference="users" offline={<span>No network, could not fetch data</span>} >
    ...
</ReferenceFieldBase>
<ReferenceFieldBase source="user_id" reference="users" offline="No network, could not fetch data" >
    ...
</ReferenceFieldBase>
```

## `queryOptions`

Use the `queryOptions` prop to pass options to [the `dataProvider.getMany()` query](./useGetOne.md#aggregating-getone-calls) that fetches the referenced record.

For instance, to pass [a custom `meta`](./Actions.md#meta-parameter):

{% raw %}
```jsx
<ReferenceFieldBase
    source="user_id"
    reference="users"
    queryOptions={{ meta: { foo: 'bar' } }}
    render={({ referenceRecord }) => referenceRecord.name}
>
    ...
</ReferenceFieldBase>
```
{% endraw %}

## `reference`

The resource to fetch for the related record.

For instance, if the `posts` resource has a `user_id` field, set the `reference` to `users` to fetch the user related to each post.

```jsx
<ReferenceFieldBase source="user_id" reference="users" >
    ...
</ReferenceFieldBase>
```


## `render`

Alternatively, you can pass a `render` function prop instead of children. This function will receive the `ReferenceFieldContext` as argument.

```jsx
export const MyReferenceField = () => (
    <ReferenceFieldBase
        source="user_id"
        reference="users"
        render={({ error, isPending, referenceRecord }) => {
            if (isPending) {
                return <p>Loading...</p>;
            }

            if (error) {
                return (
                    <p className="error">
                        {error.message}
                    </p>
                );
            }
            return <p>{referenceRecord.name}</p>;
        }}
    />
);
```

The `render` function prop will take priority on `children` props if both are set.

## `sortBy`

By default, when used in a `<Datagrid>`, and when the user clicks on the column header of a `<ReferenceFieldBase>`, react-admin sorts the list by the field `source`. To specify another field name to sort by, set the `sortBy` prop.

```jsx
<ReferenceFieldBase source="user_id" reference="users" sortBy="user.name">
    ...
</ReferenceFieldBase>
```

## Performance

<iframe src="https://www.youtube-nocookie.com/embed/egBhWqF3sWc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

When used in a [list context](./useListContext.md), `<ReferenceFieldBase>` fetches the referenced record only once for the entire table.

For instance, with this code:

```jsx
import { ListBase, RecordsIterator, ReferenceFieldBase } from 'react-admin';

export const PostList = () => (
    <ListBase
        error={null}
        offline={null}
        emptyWhileLoading
    >
        <RecordsIterator>
            <ReferenceFieldBase source="user_id" reference="users">
                <AuthorView />
            </ReferenceFieldBase>
        </RecordsIterator>
    </ListBase>
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

Then react-admin renders the `<PostList>` with a loader for the `<ReferenceFieldBase>`, fetches the API for the related users in one call (`dataProvider.getMany('users', { ids: [789,735] }`), and re-renders the list once the data arrives. This accelerates the rendering and minimizes network load.

## Prefetching

When you know that a page will contain a `<ReferenceFieldBase>`, you can configure the main page query to prefetch the referenced records to avoid a flicker when the data arrives. To do so, pass a `meta.prefetch` parameter to the page query.

For example, the following code prefetches the authors referenced by the posts:

{% raw %}
```jsx
const PostShow = () => (
    <ShowBase
        queryOptions={{ meta: { prefetch: ['author'] } }}
        render={author => (
            <div>
                <h3>{author.title}</h3>
                <ReferenceFieldBase source="author_id" reference="authors">
                    <AuthorView />
                </ReferenceFieldBase>
            </div>
        )}
    />
);
```
{% endraw %}

**Note**: For prefetching to function correctly, your data provider must support [Prefetching Relationships](./DataProviders.md#prefetching-relationships). Refer to your data provider's documentation to verify if this feature is supported.

**Note**: Prefetching is a frontend performance feature, designed to avoid flickers and repaints. It doesn't always prevent `<ReferenceFieldBase>` to fetch the data. For instance, when coming to a show view from a list view, the main record is already in the cache, so the page renders immediately, and both the page controller and the `<ReferenceFieldBase>` controller fetch the data in parallel. The prefetched data from the page controller arrives after the first render of the `<ReferenceFieldBase>`, so the data provider fetches the related data anyway. But from a user perspective, the page displays immediately, including the `<ReferenceFieldBase>`. If you want to avoid the `<ReferenceFieldBase>` to fetch the data, you can use the React Query Client's `staleTime` option.

## Access Control

If your authProvider implements [the `canAccess` method](./AuthProviderWriting.md#canaccess), React-Admin will verify whether users have access to the Show and Edit views.

For instance, given the following `ReferenceFieldBase`:

```jsx
<ReferenceFieldBase source="user_id" reference="users" />
```

React-Admin will call `canAccess` with the following parameters:
- If the `users` resource has a Show view: `{ action: "show", resource: 'posts', record: Object }`
- If the `users` resource has an Edit view: `{ action: "edit", resource: 'posts', record: Object }`

And the link property of the referenceField context will be set accordingly. It will be set to false if the access is denied.
