---
layout: default
title: "The ListBase Component"
---

# `<ListBase>`

`<ListBase>` is a headless variant of `<List>`, as it does not render anything. `<ListBase>` calls [`useListController`](./useListController.md), puts the result in a `ListContext`, then renders its child. 

If you want to display a record list in an entirely custom layout, i.e. use only the data fetching part of `<List>` and not the view layout, use `<ListBase>`.

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