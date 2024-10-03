---
layout: default
title: "The ListBase Component"
---

# `<ListBase>`

`<ListBase>` is a headless variant of [`<List>`](./List.md). It fetches a list of records from the data provider, puts it in a [`ListContext`](./useListContext.md), and renders its children. Use it to build a custom list layout.

Contrary to [`<List>`](./List.md), it does not render the page layout, so no title, no actions, no `<Card>`, and no pagination.

`<ListBase>` relies on the [`useListController`](./useListController.md) hook.

## Usage

You can use `ListBase` to create your own custom reusable List component, like this one:

```jsx
import { 
    ListBase,
    Title,
    ListToolbar,
    Pagination,
    Datagrid,
} from 'react-admin';
import { Card } from '@mui/material';

const MyList = ({ children, actions, filters, title, ...props }) => (
    <ListBase {...props}>
        <Title title={title}/>
        <ListToolbar
            filters={filters}
            actions={actions}
        />
        <Card>
            {children}
        </Card>
        <Pagination />
    </ListBase>
);

const PostList = () => (
    <MyList title="Post List">
        <Datagrid>
            ...
        </Datagrid>
    </MyList>
);
```

This custom List component has no aside component - it's up to you to add it in pure React.

## Props

The `<ListBase>` component accepts the same props as [`useListController`](./useListController.md):

* [`debounce`](./List.md#debounce)
* [`disableAuthentication`](./List.md#disableauthentication)
* [`disableSyncWithLocation`](./List.md#disablesyncwithlocation)
* [`exporter`](./List.md#exporter)
* [`filter`](./List.md#filter-permanent-filter)
* [`filterDefaultValues`](./List.md#filterdefaultvalues)
* [`perPage`](./List.md#perpage)
* [`queryOptions`](./List.md#queryoptions)
* [`resource`](./List.md#resource)
* [`sort`](./List.md#sort)

These are a subset of the props accepted by `<List>` - only the props that change data fetching, and not the props related to the user interface.

In addition, `<ListBase>` renders its children components inside a `ListContext`. Check [the `<List children>` documentation](./List.md#children) for usage examples.

## Security

The `<ListBase>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](./List.md#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<ListBase>`  will only render if the user has the "list" access to the related resource.

For instance, for the `<PostList>` page below:

```tsx
import { ListBase, Datagrid, TextField } from 'react-admin';

// Resource name is "posts"
const PostList = () => (
    <ListBase>
        <Datagrid>
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="published_at" />
        </Datagrid>
    </ListBase>
);
```

`<ListBase>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "list", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./Admin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](./List.md#disableauthentication).
