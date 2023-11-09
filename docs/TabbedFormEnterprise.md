---
layout: default
title: "TabbedForm"
---

# `<TabbedForm>`

Replacement for react-admin's `<TabbedForm>` that adds RBAC control to the delete button (conditioned by the `'delete'` action) and only renders a tab if the user has the right permissions.

Use in conjunction with [`<TabbedForm.Tab>`](#tabbedformtab) and add a `name` prop to the `Tab` to define the resource on which the user needs to have the 'write' permissions for.

**Tip:** [`<TabbedForm.Tab>`](#tabbedformtab) also allows to only render the child inputs for which the user has the 'write' permissions.

```jsx
import { Edit, TextInput } from 'react-admin';
import { TabbedForm } from '@react-admin/ra-rbac';

const authProvider = {
    checkAuth: () => Promise.resolve(),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () =>
        Promise.resolve([
            // action 'delete' is missing
            { action: ['list', 'edit'], resource: 'products' },
            { action: 'write', resource: 'products.reference' },
            { action: 'write', resource: 'products.width' },
            { action: 'write', resource: 'products.height' },
            { action: 'write', resource: 'products.thumbnail' },
            { action: 'write', resource: 'products.tab.description' },
            // tab 'stock' is missing
            { action: 'write', resource: 'products.tab.images' },
        ]),
};

const ProductEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="Description" name="description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                <TextInput source="description" />
            </TabbedForm.Tab>
            {/* the "Stock" tab is not displayed */}
            <TabbedForm.Tab label="Stock" name="stock">
                <TextInput source="stock" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Images" name="images">
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </TabbedForm.Tab>
            {/* the "Delete" button is not displayed */}
        </TabbedForm>
    </Edit>
);
```

## `<TabbedForm.Tab>`

Replacement for react-admin's `<TabbedForm.Tab>` that only renders a tab and its content if the user has the right permissions.

Add a `name` prop to the `Tab` to define the resource on which the user needs to have the 'write' permissions for.

`<TabbedForm.Tab>` also only renders the child inputs for which the user has the 'write' permissions.

```tsx
import { Edit, TextInput } from 'react-admin';
import { TabbedForm } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () =>
        Promise.resolve([
            { action: ['list', 'edit'], resource: 'products' },
            { action: 'write', resource: 'products.reference' },
            { action: 'write', resource: 'products.width' },
            { action: 'write', resource: 'products.height' },
            // 'products.description' is missing
            { action: 'write', resource: 'products.thumbnail' },
            // 'products.image' is missing
            { action: 'write', resource: 'products.tab.description' },
            // 'products.tab.stock' is missing
            { action: 'write', resource: 'products.tab.images' },
        ]),
};

const ProductEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="Description" name="description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                {/* Input Description is not displayed */}
                <TextInput source="description" />
            </TabbedForm.Tab>
            {/* Input Stock is not displayed */}
            <TabbedForm.Tab label="Stock" name="stock">
                <TextInput source="stock" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Images" name="images">
                {/* Input Image is not displayed */}
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);
```
