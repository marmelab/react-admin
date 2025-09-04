---
layout: default
title: "The ListBase Component"
storybook_path: ra-core-controller-list-listbase--no-auth-provider
---

# `<ListBase>`

`<ListBase>` is a headless List page component. It fetches a list of records from the data provider, puts it in a [`ListContext`](./useListContext.md), and renders its children. Use it to build a custom list layout.

Contrary to [`<List>`](./List.md), it does not render the page layout, so no title, no actions, no `<Card>`, and no pagination.

`<ListBase>` relies on the [`useListController`](./useListController.md) hook.

## Usage

You can use `ListBase` to create your own custom List page component, like this one:

```jsx
import { 
    DataTable,
    ListBase,
    ListToolbar,
    DataTable,
    Pagination,
    Title,
} from 'react-admin';
import { Card } from '@mui/material';

const PostList = () => (
    <ListBase>
        <Title title="Post List"/>
        <ListToolbar
            filters={[
                { source: 'q', label: 'Search', alwaysOn: true },
                { source: 'published', label: 'Published', type: 'boolean' },
            ]}
        />
        <Card>
            <DataTable>
                <DataTable.Col source="title" />
                <DataTable.Col source="author" />
                <DataTable.Col source="published_at" />
            </DataTable>
        </Card>
        <Pagination />
    </ListBase>
);
```

Alternatively, you can pass a `render` function prop instead of `children`. This function will receive the `ListContext` as argument.

```jsx
const PostList = () => (
    <ListBase render={({ data, total, isPending, error }) => (
        <Card>
            <Title title="Post List" />
            <ListToolbar
                filters={[
                    { source: 'q', label: 'Search', alwaysOn: true },
                    { source: 'published', label: 'Published', type: 'boolean' },
                ]}
            />
            <DataTable>
                {data?.map(record => (
                    <DataTable.Row key={record.id}>
                        <DataTable.Col source="title" record={record} />
                        <DataTable.Col source="author" record={record} />
                        <DataTable.Col source="published_at" record={record} />
                    </DataTable.Row>
                ))}
            </DataTable>
            <Pagination total={total} />
        </Card>
    )} />
);
```

## Props

The `<ListBase>` component accepts the following props:

* `children`
* [`debounce`](./List.md#debounce)
* [`disableAuthentication`](./List.md#disableauthentication)
* [`disableSyncWithLocation`](./List.md#disablesyncwithlocation)
* [`emptyWhileLoading`](./List.md#emptywhileloading)
* [`exporter`](./List.md#exporter)
* [`filter`](./List.md#filter-permanent-filter)
* [`filterDefaultValues`](./List.md#filterdefaultvalues)
* [`offline`](./List.md#offline)
* [`perPage`](./List.md#perpage)
* [`queryOptions`](./List.md#queryoptions)
* `render`
* [`resource`](./List.md#resource)
* [`sort`](./List.md#sort)
* [`storeKey`](./List.md#storeKey)

In addition, `<ListBase>` renders its children components inside a `ListContext`. Check [the `<List children>` documentation](./List.md#children) for usage examples.


## Security

The `<ListBase>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](./List.md#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<ListBase>`  will only render if the user has the "list" access to the related resource.

For instance, for the `<PostList>` page below:

```tsx
import { ListBase, DataTable } from 'react-admin';

// Resource name is "posts"
const PostList = () => (
    <ListBase>
        <DataTable>
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="published_at" />
        </DataTable>
    </ListBase>
);
```

`<ListBase>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "list", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./Admin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](./List.md#disableauthentication).
