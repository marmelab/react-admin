---
layout: default
title: "useListController"
---

# `useListController`

As explained above, `<ListBase>` fetches the data and puts it in a `ListContext`, then renders its child. In fact, the `<ListBase>` code is super simple:

```jsx
import * as React from 'react';
import { useListController, ListContextProvider } from 'react-admin';

const ListBase = ({ children, ...props }) => (
    <ListContextProvider value={useListController(props)}>
        {children}
    </ListContextProvider>
);

export default ListBase;
```

As you can see, the controller part of the List view is handled by a hook called `useListController`. If you don't want to use the `ListContext` in your custom List view, you can call `useListController` directly to access the list data. It returns the same object as the one documented in [`useListContext`](#uselistcontext) above.

**Tip**: If your custom List view doesn't use a `ListContextProvider`, you can't use `<Datagrid>`, `<SimpleList>`, `<Pagination>`, etc. All these components rely on the `ListContext`.