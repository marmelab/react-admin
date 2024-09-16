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