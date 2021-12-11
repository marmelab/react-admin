---
layout: default
title: "useList"
---

# `useList`

The `useList` hook allows to apply the list features such as filtering, sorting and paginating on an array of records you already have.

Thanks to it, you can display your data inside a [`<Datagrid>`](#the-datagrid-component), a [`<SimpleList>`](#the-simplelist-component) or an [`<EditableDatagrid>`](#the-editabledatagrid-component). For example:

```jsx
const data = [
    { id: 1, name: 'Arnold' },
    { id: 2, name: 'Sylvester' },
    { id: 3, name: 'Jean-Claude' },
]
const ids = [1, 2, 3];

const MyComponent = () => {
    const listContext = useList({
        data,
        ids,
        basePath: '/resource',
        resource: 'resource',
    });
    return (
        <ListContextProvider value={listContext}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
            </Datagrid>
        </ListContextProvider>
    );
};
```