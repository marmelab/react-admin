---
layout: default
title: "The ListBase Component"
---

# `<ListBase>`

In addition to fetching the list data, the `<List>` component renders the page title, the actions, the content and aside areas. You may want to display a record list in an entirely different layout, i.e. use only the data fetching part of `<List>` and not the view layout. In that case, you should use `<ListBase>`.

`<ListBase>` fetches the data and puts it in a `ListContext`, then renders its child.

You can use `ListBase` to create your own custom List component, like this one:

```jsx
import * as React from 'react';
import { cloneElement } from 'react';
import { 
    Datagrid,
    ListBase,
    ListToolbar,
    BulkActionsToolbar,
    Pagination,
    Title,
    useListContext,
} from 'react-admin';
import Card from '@mui/material/Card';

const PostList = props => (
    <MyList {...props} title="Post List">
        <Datagrid>
            ...
        </Datagrid>
    </MyList>
);

const MyList = ({children, actions, bulkActionButtons, filters, title, ...props}) => (
    <ListBase {...props}>
        <Title title={title}/>
        <ListToolbar
            filters={filters}
            actions={actions}
        />
        <Card>
            <BulkActionsToolbar>
                {bulkActionButtons}
            </BulkActionsToolbar>
            {cloneElement(children, {
                hasBulkActions: bulkActionButtons !== false,
            })}
            <Pagination />
        </Card>
    </ListBase>
);
```

This custom List component has no aside component - it's up to you to add it in pure React.

**Tip**: You don't have to clone the child element. If you can't reuse an existing list view component like `<Datagrid>` or `<SimpleList>`, feel free to write the form code inside your custom `MyList` component. 

The `<ListBase>` component accepts a subset of the props accepted by `<List>` - only the props that change data fetching, and not the props related to the user interface:

* [`exporter`](#exporter)
* [`filter`](#filter-permanent-filter) (the permanent filter used in the REST request)
* [`filterDefaultValues`](#filterdefaultvalues) (the default values for `alwaysOn` filters)
* [`perPage`](#perpage-pagination-size)
* [`sort`](#sort-default-sort-field--order)
* [`pagination`](#pagination-pagination-component)